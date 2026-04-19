import os
import openai
from datetime import datetime

# Set up your OpenAI API key (you will use GitHub Secrets for this)
openai.api_key = os.getenv("OPENAI_API_KEY")  # Using the GitHub secret for the API key

# Path to the folder where your HTML files are stored
html_files_directory = "./html_files"  # Make sure this folder exists

# Function to generate a 3000-word article using OpenAI GPT-3/4
def generate_article(prompt, word_count_target=3000):
    response = openai.Completion.create(
        model="text-davinci-003",  # You can choose another model if necessary
        prompt=prompt,
        max_tokens=word_count_target * 5,  # Approximate number of tokens for 3000 words
        temperature=0.7,  # Adjust for creativity
        top_p=1.0,  # Adjust sampling strategy
        frequency_penalty=0.5,
        presence_penalty=0.0
    )
    return response.choices[0].text.strip()

# Function to create a new HTML file with the generated content
def create_html_file(content, file_name):
    # Basic HTML structure for the article
    html_content = f"""
    <html>
    <head>
        <title>{file_name}</title>
    </head>
    <body>
        <h1>{file_name}</h1>
        <p>{content}</p>
    </body>
    </html>
    """
    
    # Save to a new HTML file
    output_file_path = os.path.join(html_files_directory, f"{file_name}.html")
    with open(output_file_path, "w") as file:
        file.write(html_content)

# Function to process each HTML file and generate an article for each
def process_html_files():
    if not os.path.exists(html_files_directory):
        print(f"Error: The directory {html_files_directory} does not exist.")
        return

    # Get all HTML files in the specified directory
    html_files = [f for f in os.listdir(html_files_directory) if f.endswith('.html')]

    if not html_files:
        print(f"Error: No HTML files found in the {html_files_directory} directory.")
        return

    for html_file in html_files:
        # You can customize the prompt here based on the content you want to generate
        prompt = f"Write a detailed article with at least 3000 words about {html_file.replace('.html', '')}."

        # Generate a 3000-word article
        article = generate_article(prompt)

        # Create a new HTML file with the generated article
        current_date = datetime.now().strftime("%Y-%m-%d")
        create_html_file(article, f"article_{current_date}_{html_file.replace('.html', '')}")
        
        print(f"Article generated for: {html_file}")

# Run the process
if __name__ == "__main__":
    process_html_files()
