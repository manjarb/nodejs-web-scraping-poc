import { adjustAssetPaths } from "./html.util";

describe("adjustAssetPaths", () => {
  const scenarios = [
    {
      description: "should leave absolute URLs unchanged (http)",
      input: `<img src="http://example.com/image.png" />`,
      expected: `<img src="http://example.com/image.png" />`,
    },
    {
      description: "should leave absolute URLs unchanged (https)",
      input: `<link href="https://example.com/style.css" />`,
      expected: `<link href="https://example.com/style.css" />`,
    },
    {
      description:
        "should convert protocol-relative URLs to http (double quotes)",
      input: `<script src="//example.com/script.js"></script>`,
      expected: `<script src="http://example.com/script.js"></script>`,
    },
    {
      description:
        "should convert protocol-relative URLs to http (single quotes)",
      input: `<script src='//example.com/script.js'></script>`,
      expected: `<script src='http://example.com/script.js'></script>`,
    },
    {
      description: "should convert protocol-relative URLs to http (no quotes)",
      input: `<script src=//example.com/script.js></script>`,
      expected: `<script src=http://example.com/script.js></script>`,
    },
    {
      description:
        "should convert root-relative URLs to relative paths (double quotes)",
      input: `<a href="/about.html">About</a>`,
      expected: `<a href="./about.html">About</a>`,
    },
    {
      description:
        "should convert root-relative URLs to relative paths (single quotes)",
      input: `<a href='/about.html'>About</a>`,
      expected: `<a href='./about.html'>About</a>`,
    },
    {
      description:
        "should convert root-relative URLs to relative paths (no quotes)",
      input: `<a href=/about.html>About</a>`,
      expected: `<a href=./about.html>About</a>`,
    },
    {
      description: "should leave relative URLs unchanged",
      input: `<img src="./assets/image.png" />`,
      expected: `<img src="./assets/image.png" />`,
    },
    {
      description: "should leave relative URLs unchanged (without ./)",
      input: `<link href="assets/style.css" />`,
      expected: `<link href="assets/style.css" />`,
    },
    {
      description: "should leave data URLs unchanged",
      input: `<img src="data:image/png;base64,..." />`,
      expected: `<img src="data:image/png;base64,..." />`,
    },
    {
      description: "should leave mailto URLs unchanged",
      input: `<a href="mailto:someone@example.com">Email</a>`,
      expected: `<a href="mailto:someone@example.com">Email</a>`,
    },
  ];

  scenarios.forEach(({ description, input, expected }) => {
    it(description, () => {
      const result = adjustAssetPaths(input);
      expect(result).toBe(expected);
    });
  });
});
