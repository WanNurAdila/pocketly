*** Settings ***
Documentation     A basic end-to-end smoke test for our Vue application.
Library           Browser
Suite Setup       Open Browser To Home Page
Test Setup        New Context    viewport={'width': 1280, 'height': 720}
Test Teardown     Close Context

*** Variables ***
${BASE_URL}       https://pocketly-budgeting.vercel.app
${EMAIL}          demo@pocketly.app
${PASSWORD}       pocket1234
${BYPASS_SECRET}  ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}

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

    Get Element  text=Welcome back.
    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  ${PASSWORD}
    Click        "Sign in"
    Wait For Elements State  text=Dashboard >> visible=true  visible

Verify Login Fails with Incorrect Credentials
    [Documentation]    Verifies that the login fails when incorrect credentials are provided.
    [Tags]             smoke
    New Page           ${BASE_URL}

    Get Element  text=Welcome back.
    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  wrongPassword
    Click        "Sign in"
    Wait For Elements State  text=Incorrect email or password. Try again. >> visible=true  visible


*** Keywords ***
Open Browser To Home Page
    Log To Console    BYPASS_SECRET length: ${{ len("${BYPASS_SECRET}") }}
    New Browser    chromium    headless=${HEADLESS}
    ${headers}=    Create Dictionary
    ...    x-vercel-protection-bypass=${BYPASS_SECRET}
    ...    x-vercel-set-bypass-cookie=true
    New Context    extraHTTPHeaders=${headers}
    
    # CRITICAL: use the bypass via URL too — this sets the cookie
    ${bypass_url}=    Catenate    SEPARATOR=
    ...    ${BASE_URL}
    ...    ?x-vercel-protection-bypass=
    ...    ${BYPASS_SECRET}
    ...    &x-vercel-set-bypass-cookie=samesitenone
    Log To Console    Navigating to URL with bypass query params
    New Page    ${bypass_url}
    Sleep       3s