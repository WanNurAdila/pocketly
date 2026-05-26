*** Settings ***
Documentation     A basic end-to-end smoke test for our Vue application.
Library           Browser
Resource          ../resources/auth.robot
Resource          ../variables/variables.robot
Suite Setup       New Browser    browser=chromium    headless=${HEADLESS}
Suite Teardown    Close Browser
Test Setup        New Context    viewport={'width': 1280, 'height': 720}
Test Teardown     Close Context

*** Variables ***
${HEADLESS}       False

*** Test Cases ***
Verify Website Loads Successfully
    [Documentation]  Verifies that the website loads successfully and displays the expected content.
    [Tags]           smoke
    New Page         ${BASE_URL_POCKETLY}

    Get Element  text=Sign in to your account
    Get Element  text=Welcome back.

Verify Login Functionality Works Correctly
    [Documentation]    Verifies that the login functionality works correctly.
    [Tags]             smoke
    Login    ${TEST_EMAIL_POCKETLY}    ${TEST_PASSWORD_POCKETLY}
    Wait For Elements State  [data-testid="nav-home"]  visible    timeout=10s

Verify Login Fails with Incorrect Credentials
    [Documentation]    Verifies that the login fails when incorrect credentials are provided.
    [Tags]             smoke
    New Page           ${BASE_URL_POCKETLY}

    Fill Text    data-testid=input-email    ${TEST_EMAIL_POCKETLY}
    Fill Text    data-testid=input-password    wwww123
    Click    role=button[name="Sign in"]
    Wait For Elements State  text=Incorrect email or password. Try again.  visible
