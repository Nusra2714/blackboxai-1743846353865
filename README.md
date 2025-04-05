
Built by https://www.blackbox.ai

---

```markdown
# Tamil/English Text to Image Generator

## Project Overview

The Tamil/English Text to Image Generator is a web application that allows users to convert text in Tamil and English into visually appealing images. This application is designed to support genres such as movies and general themes, allowing for customized image generation based on user inputs. 

## Features

- Support for both Tamil and English text inputs.
- Choice of genres and image styles to enhance creativity.
- "Story Mode" feature for generating a sequence of images using multiple sentences.
- User authentication for saving generated images to a personal gallery.
- Provides a gallery to showcase saved images.
- Responsive design using Bootstrap.

## Installation

To run the application locally, you need to clone the repository and install the necessary dependencies.

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-repo>/tamil-text-to-image.git
   cd tamil-text-to-image
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file to add your Firebase configuration variables:
   ```plaintext
   API_KEY=YOUR_ACTUAL_API_KEY
   AUTH_DOMAIN=YOUR_ACTUAL_AUTH_DOMAIN
   PROJECT_ID=YOUR_ACTUAL_PROJECT_ID
   STORAGE_BUCKET=YOUR_ACTUAL_STORAGE_BUCKET
   MESSAGING_SENDER_ID=YOUR_ACTUAL_SENDER_ID
   APP_ID=YOUR_ACTUAL_APP_ID
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8000`.

## Usage

1. Open your web browser and navigate to `http://localhost:8000`.
2. Select the language for input text (Tamil or English).
3. Enter your text in the provided textarea. You may also upload a text file if you have chosen "Story Mode."
4. Choose your desired genre and image style.
5. Click the "Generate Images" button to create images.
6. You can download or save the generated images to your gallery after they are displayed.

## Dependencies

The server and client-side code relies on the following dependencies:

- **Server-side:**
  - express: ^4.21.2
  - cors: ^2.8.5
  - dotenv: ^16.4.7
  - express-rate-limit: ^6.11.2
  - firebase: ^9.23.0

- **Client-side:**
  - bootstrap: 5.3.0
  - font-awesome: 6.0.0-beta3
  - google-fonts: Noto Sans Tamil

For complete dependency information, review the `package.json` file.

## Project Structure

```
tamil-text-to-image/
├── client/                     # The client-side application
│   ├── index.html              # Main HTML for the text to image generation
│   ├── results.html            # Page for displaying generated images
│   ├── gallery.html            # Page for viewing saved images
│   ├── script.js               # Client-side scripts for functionality
│   ├── styles.css              # CSS for the application styles
├── server/                     # The server-side application
│   ├── server.js               # Entry point for the server
│   ├── .env                    # Environment variables (not committed to version control)
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked versions of dependencies
```

---

For further information and to contribute, please visit our [GitHub Repository](https://github.com/<your-repo>/tamil-text-to-image). Enjoy generating images from your text!
```