*** Settings ***
Library    Browser
Resource   ../variables/variables.robot

*** Keywords ***
Login
    [Arguments]    ${email}=${TEST_EMAIL_POCKETLY}    ${password}=${TEST_PASSWORD_POCKETLY}
    New Page    ${BASE_URL_POCKETLY}
    Fill Text    data-testid=input-email    ${email}
    Fill Text    data-testid=input-password    ${password}
    Click    role=button[name="Sign in"]
    Get Url    ==    ${BASE_URL_POCKETLY}/home    retry_assertions_for=10s
