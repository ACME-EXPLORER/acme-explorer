Feature: NotFoundError
    This is a test for the NotFoundError.
    Scenario:
        Given I have a NotFoundError
        When I call the serializeErrors
        Then I should get a NotFoundError with the message "Not Found"
