*** Settings ***
Documentation     A basic end-to-end smoke test for our Vue application.
Library           Browser
Suite Setup       New Browser    browser=chromium    headless=${HEADLESS}
Suite Teardown    Close Browser
Test Setup        New Context    viewport={'width': 1280, 'height': 720}
Test Teardown     Close Context

*** Variables ***
${BASE_URL}       https://pocketly-budgeting.vercel.app
${HEADLESS}       False
${EMAIL}          demo@pocketly.app
${PASSWORD}       pocket1234

*** Test Cases ***
Verify Website Loads Successfully
    [Documentation]  Verifies that the website loads successfully and displays the expected content.
    [Tags]           smoke
    New Page         ${BASE_URL}

    Get Element  text=Sign in to your account
    Get Element  text=Welcome back.

Verify Login Functionality Works Correctly
    [Documentation]    Verifies that the login functionality works correctly.
    [Tags]             smoke
    New Page           ${BASE_URL}

    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  ${PASSWORD}
    Click        "Sign in"
    Wait For Elements State  [data-testid="nav-home"]  visible    timeout=10s

Verify Login Fails with Incorrect Credentials
    [Documentation]    Verifies that the login fails when incorrect credentials are provided.
    [Tags]             smoke
    New Page           ${BASE_URL}

    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  wwww123
    Click        "Sign in"
    Wait For Elements State  text=Incorrect email or password. Try again.  visible
