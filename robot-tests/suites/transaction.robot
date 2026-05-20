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
${DISPLAY_NAME}   Jordan

*** Test Cases ***
Verify Login to Correct Credentials
    [Documentation]    Verifies that a user can log in with correct credentials and see their display name in the top bar.
    [Tags]             smoke
    New Page           ${BASE_URL}

    Get Element  text=Welcome back.

    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  ${PASSWORD}
    Click        "Sign in"
    Get Text    [data-testid="topbar"]    contains    ${DISPLAY_NAME}

Verify Can View Transactions
    [Documentation]    Verifies that a user can view their transactions after logging in.
    [Tags]             smoke
    New Page           ${BASE_URL}

    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  ${PASSWORD}
    Click        "Sign in"
    Wait For Elements State  [data-testid="nav-list"]  visible    timeout=10s

Verify Can View Specific Transaction
    [Documentation]    Verifies that a user can view the details of a specific transaction.
    [Tags]             smoke
    New Page           ${BASE_URL}


    Fill Text    id=input-email  ${EMAIL}
    Fill Text    id=input-password  ${PASSWORD}
    Click        "Sign in"
    Wait For Elements State  [data-testid="nav-list"]  visible    timeout=10s
    Click       [data-testid="nav-list"]
    Click       text=Groceries
    Get Text    [data-testid="topbar"]    contains    Trader Joe's