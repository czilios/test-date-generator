# Random Date Generator – Playwright Test Assignment

# Project Structure

tests/
  test_case_1.spec.ts
  test_case_2.spec.ts
  test_case_3.spec.ts
  test_case_4.spec.ts
  test_case_5.spec.ts

helpers/
  dateGenerator.ts

run-tests-60min.ps1

# Project Overview

This repository contains automated tests for a **Random Date Generator** available at:

https://codebeautify.org/generate-random-date

The goal of this project was to demonstrate **testing approach, test design, and automation skills** within a limited time frame (1 hour), as required in the assignment.

The focus of testing was strictly on the **random date generator functionality**. Other parts of the website (links such as JSON Formatter, Hex Color Codes, etc.) were explicitly excluded from scope.

---

# Testing Approach

Due to the limited time constraint, the approach focused on testing the **core functionality of the generator**, covering the most critical aspects:

- correctness of generated date count
- validation of generated date formats
- validation of date ranges
- handling of edge cases
- handling of invalid or reversed input ranges
- detection of potential duplicate values
- validation of multiple output formats

The tests were automated using **Playwright with TypeScript**.

---

# Test Strategy

The following areas were considered the most important to validate:

### 1. Generator Output Count
Verify that the generator returns the requested number of dates.

### 2. Date Format Validation
Ensure that generated dates match the selected output format.

### 3. Date Range Validation
Verify that generated dates fall within the specified start and end date range.

### 4. Reversed Date Range Handling
Validate behaviour when the **end date is lower than the start date**.

### 5. Date-Time Range Validation
Ensure that generated times fall within specified time boundaries.

### 6. Duplicate Detection
Check whether the generator produces duplicate values when generating large sets.

### 7. Multi-format Validation
Validate multiple supported output formats.

---

# Implemented Test Cases

### Test Case 1 – Generated Date Count and Default Format
Validates that:

- the correct number of dates is generated
- the format matches **MM-DD-YYYY**
- generated dates fall within a reasonable date range

---

### Test Case 2 – Reversed Date Range Input
Validates behaviour when:
endDate < startDate
Ensures that the generator does not produce dates outside the valid range.

---

### Test Case 3 – Custom Date-Time Range
Validates:

- custom date-time format
- time boundaries
- correct parsing of date and time components

---

### Test Case 4 – Large Dataset Validation (500 values)
Tests generator behaviour when generating **large datasets**, verifying:

- correct count
- correct format
- detection of duplicate values

---

### Test Case 5 – Multiple Output Format Validation
Iterates through all available date formats and validates that:

- generated output matches the expected pattern
- formats are correctly applied by the generator

---

# Technology Stack

- **Playwright**
- **TypeScript**
- **Node.js**

---

# How to Run Tests

Install dependencies:
npm install

Run tests:
npx playwright test --reporter=line

---

# Test Report

After running the tests, an HTML report can be generated using:

npm run report
The Playwright report provides:

- detailed test results
- step execution logs
- screenshots and traces on failure

---

# Assumptions

Due to limited time and lack of clarification during the assignment, the following assumptions were made:

- the generator should always respect the requested number of generated dates
- generated dates should follow the selected output format
- generated dates should fall within the specified range
- the generator should not return values outside valid boundaries

---

# Possible Improvements

Given more time, the following improvements could be implemented:

- boundary testing (startDate == endDate)
- negative input validation
- performance testing for large datasets
- additional validation of timezone formats
- improved page object structure

---

# Author Notes

The goal of this project was not only to detect bugs, but to demonstrate:

- test design thinking
- structured test approach
- automation strategy under time constraints

# Possible Improvements

Given more time, the following improvements could be implemented to make the test suite more maintainable and scalable:

### Page Object Model (POM)

Introduce a **Page Object Model** structure to separate page interaction logic from test logic.

Currently the tests interact directly with locators such as:

page.locator('#count')

In a larger test suite this could be moved to a dedicated page object, for example:

pages/DateGeneratorPage.ts

Benefits:
- better test readability
- easier maintenance if UI changes
- reusable page actions

---

### Improved Test Data Management

Introduce a dedicated structure for managing test data such as:

- date ranges
- supported formats
- boundary values

This would allow tests to reuse common datasets and improve readability.

---

### Boundary Testing

Additional boundary tests could be added, such as:

- startDate = endDate
- minimum allowed date
- maximum allowed date
- very large values for generated date count

---

### Negative Input Testing

Validate behaviour for invalid input values such as:

- negative numbers
- empty inputs
- unsupported formats

---
# Extended Stability Testing

An additional PowerShell script was created to repeatedly execute the test suite for 60 minutes.

This allows observing generator behaviour over time and detecting potential:

- flaky behaviour
- intermittent format issues
- unstable output generation

This approach helps simulate longer execution scenarios beyond a single test run.

---

# Performance Testing

Large dataset generation (e.g. thousands of dates) could be used to evaluate:

- generator response time
- browser rendering behaviour

---

### Test Architecture Improvements

The current structure is intentionally simple due to time constraints.

For a larger project the following structure could be introduced:

tests/
pages/
helpers/
utils/

This would allow better separation of concerns and improved maintainability.

---
# Observations

During extended execution (1h stability run), the following observations were made:

- ...
- ...



