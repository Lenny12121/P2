## Description:

Here we built a feature request tracking app so that product owners can easily gain feedback from their users. There is a dashboard view where the admin can manage the feature suggestions as well as a public page that the admin can customise and integrate into  their product to collect feedback from users. Stop guessing and start building what your customers actually want.

To make the code more readable it has been re-factored to utilise various controllers and partials for the navigation and footer have been implemented.

1. [Live Demo](https://shielded-anchorage-77439.herokuapp.com/sign-up/new)

## Technologies used:
This product has been built using Express, EJS, Javascript, jQuery, Multer, bcrypt and Bootstrap.

## Still unsolved:

1. Currently the up/downvote feature for each submitted request allows users to vote as many times as possible. This should be restricted to one vote per user per feature suggestion. Additionally, the feature requests are not ordered by the amount of upvotes received. To achieve this a "dummy" user session needs to be created for users that are not logged in/signed up in order to identify them.

2. Upon signup, the user is asked to login. Ideally the signup should automatically log them in to reduce friction. This can easily be achieved by running the login script at the same time as the signup script.