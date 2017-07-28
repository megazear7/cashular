Solution to the problem of sharing transaction callback data between react components:
    - Dont pass the results of the api request to child components, pass the
      definition of the request, and then add to that request stuff specific to
      that component, and then make the request in the component itself.

I've replaced all api GET calls with graphql requests, need to remove the legacy API.

Need to simplify the method of getting transaction data for the react components in order
    to be proper react components instead of sharing so much implementation details
    between components.


Need to enhance graphql to enable mutations.

Trying to integrate graphql. Wanted to use react relay as well but it doesn't
seem to be easy to do with rails.

Add ability to rename envelopes

Be able to tag transactions with a further description. Example of use:
    - the google pay $16 was sherlock!!!

Fix css includes so that I dont have to !important everything

Put external libraries into vendor folder

material-ui.com is a react + material integration. Should we reimplememt the site with this?
