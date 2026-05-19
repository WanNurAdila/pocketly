*** Settings ***
Documentation     A basic end-to-end smoke test for our Vue application.
Library           Browser
Suite Setup       New Browser    browser=chromium    headless=False
Test Setup        New Context    viewport={'width': 1280, 'height': 720}
Test Teardown     Close Context

*** Variables ***
${BASE_URL}       http://localhost:5173    # Default Vite local dev server port

*** Test Cases ***
Verify App Home Page Loads Successfully
    [Documentation]    Ensures the Vue landing page components render safely.
    [Tags]             smoke
    New Page           ${BASE_URL}
    
    # Assertions using Playwright-backed selectors
    Get Text           h1 >> text=Welcome to Your Vue.js App
    
    # Taking a visual snapshot for the reports
    Take Screenshot