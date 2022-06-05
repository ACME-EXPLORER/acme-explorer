Feature: BaseError
    This is the base class for all errors in the
    acme explorer.

    Scenario: BaseError
        Given I have a BaseError
        When I call toClient
        Then I get a Array with the error message