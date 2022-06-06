Feature: RequestValidationError
    This is a test for the RequestValidationError.
    Scenario:
        Given I have a RequestValidationError
        When I call the toClient
        Then I should get a RequestValidationError with the array of errors
