*** Settings ***
Documentation     A basic end-to-end smoke test for Transaction feature in Pocketly.
Library           Browser
Suite Setup       New Browser    browser=chromium    headless=${HEADLESS}    slowMo=1s
Suite Teardown    Close Browser
Test Setup        New Context    viewport={'width': 1280, 'height': 720}
Test Teardown     Close Context

***Variables***
${BASE_URL}    https://pocketly-budgeting.vercel.app
${TEST_EMAIL}    demo@pocketly.app
${TEST_PASSWORD}    pocket1234
${HEADLESS}    False

***Keywords***
Login And Redirect To Transactions Page
    [Arguments]    ${email}    ${password}
    New Page    ${BASE_URL}
    Fill Text    text="Email"    ${email}
    Fill Text    text="Password"    ${password}
    Click    role=button[name='Sign in']
    GetUrl    ==    ${BASE_URL}/home
    Click    role=link[name='Transactions']

Fill Transaction Form
    [Arguments]    ${merchant_Name}    ${amount}    ${category_Value}    ${Date}    ${Note}
    Fill Text    data-testid=input-merchant    ${merchant_Name}
    Fill Text    data-testid=input-amount    ${amount}
    Select Options By    id=modal-category    value    ${category_Value}
    Fill Text    id=modal-date    ${Date}
    Fill Text    data-testid=input-note    ${Note}
    Click    data-testid=btn-save


*** Test Cases ***
Create New Transaction
    [Documentation]    Create New transaction
    [Tags]    smoke
    Login And Redirect To Transactions Page    ${TEST_EMAIL}    ${TEST_PASSWORD}
    Click    text=Add Transaction
    Fill Transaction Form    MPH    50    Books    2025-04-12    harry potter book
        Wait For Elements State    text='MPH'    visible    2s

Delete The First Transaction
    [Documentation]    Delete the first transaction 
    [Tags]    smoke
    Login And Redirect To Transactions Page    ${TEST_EMAIL}    ${TEST_PASSWORD}
    Click    data-testid=tx-card-tx_001
    Click    text=Delete
    Check Checkbox    data-testid=confirm-acknowledge    true
    Click    data-testid=btn-confirm-delete
    Wait For Elements State    data-testid=tx-card-tx_001    hidden

Edit The First Transaction
    [Documentation]    Edit the first transaction
    [Tags]    smoke
    Login And Redirect To Transactions Page    ${TEST_EMAIL}    ${TEST_PASSWORD}
    Click    data-testid=tx-card-tx_004
    Click    text=Edit
    Fill Transaction Form    Youtube    25    Subscriptions    2025-04-20    youtube premium
    Wait For Elements State    h1:has-text('Youtube')    visible    2s
