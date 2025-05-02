from flask import current_app
from openai import AzureOpenAI
import re

def get_openai_client():
    """Create OpenAI client using the app's configuration."""
    return AzureOpenAI(
        api_key=current_app.config['AZURE_OPENAI_API_KEY'],
        api_version=current_app.config['OPENAI_API_VERSION'],
        azure_endpoint=current_app.config['AZURE_OPENAI_ENDPOINT']
    )

def parse_response(raw_text):
    sections = {
        "overview": "",
        "keyPoints": [],
        "actionItems": []
    }

    current_section = None

    for line in raw_text.split('\n'):
        line = line.strip()

        # Detect section headers and extract initial content
        if line.lower().startswith("### overview"):
            current_section = "overview"
            # Extract content from the same line if present
            parts = re.split(r'### overview', line, flags=re.IGNORECASE)
            if len(parts) > 1 and parts[1].strip():
                clean_content = ' '.join(parts[1].strip().split())
                sections["overview"] = clean_content
        elif line.lower().startswith("### key points"):
            current_section = "keyPoints"
        elif line.lower().startswith("### action items"):
            current_section = "actionItems"

        # Process content lines
        elif current_section:
            if current_section == "overview":
                # Clean and add line content to overview
                clean_line = ' '.join(line.split())
                if sections["overview"]:
                    sections["overview"] += " " + clean_line
                else:
                    sections["overview"] = clean_line
                sections["overview"] = sections["overview"].strip()
            elif line.startswith('-'):
                clean_line = line[1:].strip()
                if clean_line:
                    sections[current_section].append(clean_line)

    return sections


def process_content(content):
    client = get_openai_client()
    try:
        system_prompt = """You are a meeting minutes expert. Format the response EXACTLY as:

### Overview
[Meeting title] | [Date in YYYY-MM-DD format]

### Key Points
- [Speaker]: [Key point]
- [Speaker]: [Key point]

### Action Items
- [Speaker]: [Task with deadline]

Important rules:
1. Overview must be on a new line after the header
2. Use normal spacing between words
3. Dates must be in YYYY-MM-DD format
4. Never add extra spaces between letters"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Create minutes from:\n\n{content}"}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        if not response.choices:
            return {"success": False, "message": "No response from AI"}

        # Initial parsing
        raw_text = response.choices[0].message.content.strip()
        sections = parse_response(raw_text)

        # Fallback for missing sections
        retry_count = 0
        while retry_count < 2 and (not sections["keyPoints"] or not sections["actionItems"]):
            retry_count += 1
            follow_up_prompt = f"""Fix this incomplete response. MISSING: 
            {'' if sections["keyPoints"] else 'Key Points'} 
            {'' if sections["actionItems"] else 'Action Items'}
            \n\nOriginal Transcript:\n{content}"""

            follow_up_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": follow_up_prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )

            if follow_up_response.choices:
                raw_text = follow_up_response.choices[0].message.content.strip()
                sections = parse_response(raw_text)

        return {
            "success": True,
            "minutes": {
                "overview": sections["overview"],
                "keyPoints": sections["keyPoints"],
                "actionItems": sections["actionItems"]
            }
        }

    except Exception as e:
        current_app.logger.error(f"OpenAI Error: {str(e)}")
        return {"success": False, "message": str(e)}
