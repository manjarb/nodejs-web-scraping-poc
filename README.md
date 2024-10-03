# Fetch Web Pages - Dockerized Command-Line Tool

I created this project as part of my journey to build robust and efficient command-line tools in a Dockerized environment. This tool allows you to fetch web pages, save their HTML content and assets, and record metadata—all while leveraging the simplicity and isolation provided by Docker. Let me walk you through my approach and how you can use this tool.

## Background and Story

As a developer passionate about creating efficient and reusable code, I wanted to build a tool that not only performs well but is also easy to run in any environment. The goal was to create a command-line program that can be executed with a single Docker command, handling everything from fetching content to saving assets and metadata—all with minimal setup.

I wanted this tool to be scalable and flexible for a variety of use cases, including downloading static content for offline viewing or mirroring websites for testing purposes. By containerizing the project using Docker, I ensured that anyone could run this tool on any system without worrying about dependencies or environment issues.

## Prerequisites

Ensure you have Docker installed on your system before proceeding:
- Docker (https://docs.docker.com/get-docker/)

## Setup and Usage

### Build the Docker Image

1. **Clone the Repository**

   git clone https://github.com/manjarb/nodejs-web-scraping-poc.git
   cd nodejs-web-scraping-poc

2. **Build the Docker Image**

   Build the Docker image, which packages all the necessary code and dependencies:

   ```
   npm run docker:build
   # or
   docker build -t nodejs-web-scraping-poc .
   ```

   This creates a Docker image named `nodejs-web-scraping-poc`

### Run the Docker Container

1. **Run the Container in Interactive Mode**

   Start the container with a volume mapped to your host's `web-pages` directory to ensure the fetched content is saved outside the container:

   ```
   npm run docker:run
   # or
   docker run -it --rm -v $(pwd)/web-pages:/app/web-pages nodejs-web-scraping-poc
   ```

   **Explanation**:
   - `-it`: Runs the container interactively.
   - `--rm`: Removes the container after it stops.
   - `-v $(pwd)/web-pages:/app/web-pages`: Maps the `web-pages` folder in your current directory to `/app/web-pages` inside the container.

2. **Execute the Fetch Command**

   Inside the container's terminal, you can use the following command to fetch web pages:

   ```
   npm run fetch https://www.google.com http://vgvit.com -- --metadata
   ```

   The fetched content, including assets and metadata, will be saved to the `web-pages` folder on your host machine.

### Example Use Case

For example, if you want to download the content of `https://www.google.com` and `http://vgvit.com` while recording metadata about each fetch, you would use:

```
npm run fetch https://www.google.com http://vgvit.com -- --metadata
```

The files will be saved in `web-pages` with the necessary HTML and assets, and a metadata file will also be created.

## Project Structure

```
fetch-web-pages/
│
├── src/                     # Source code (TypeScript)
│   ├── interfaces/          # TypeScript interfaces
│   ├── utils/               # Utility functions
│   ├── fetch.ts             # Main fetch script
│
├── web-pages/               # Fetched web pages (mapped via Docker volume)
├── Dockerfile               # Docker configuration
├── .dockerignore            # Docker ignore file
├── package.json             # NPM package file
└── tsconfig.json            # TypeScript configuration
```

## My Approach and Challenges

- **Designing a Reusable CLI Tool**: The main challenge was to ensure that the tool could accept multiple URLs, fetch their content and assets, and save the results in an organized manner.
- **Containerization with Docker**: By Dockerizing the project, I ensured that all dependencies were isolated and the tool could be executed on any system without setup issues.
- **Asset and Metadata Handling**: Parsing HTML to find and download assets like images, CSS, and JavaScript files, as well as storing metadata like the number of links and images.

## Future Improvements

- **Customization**: Allow more flexibility in the command-line options for specifying output formats and supported asset types.
- **Performance**: Improve concurrency for asset downloading to make the fetch process faster.
- **Additional Metadata**: Include more detailed metadata, such as page size and load time.

---

## Conclusion

This project allowed me to enhance my skills in building command-line tools, handling web assets, and leveraging Docker for an easy-to-run and maintainable environment. It provides a quick way to fetch, save, and analyze web pages while ensuring the tool remains isolated and consistent across different machines.

Feel free to reach out for any questions or suggestions for improvement!
