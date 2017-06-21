## General Requirements

- [x] __10:__ Solution is in a public repository called `phase-4-challenge`.
- [x] __10:__ All dependencies are declared in a `package.json` file.
- [x] __10:__ Express is used for the web server.
- [x] __10:__ PostgreSQL is used for the database.
- [x] __10:__ Database is seeded with at least 4 albums (check out the [sample data](#sample-data)).

_The items that are already checked off have been completed in the [scaffold][scaffold]._

## Stage 1: Basic User Authentication & Profiles

Allow users to sign up, sign in, view their profile page, and sign out.

#### Requirements

**Users can...**

- [x] __20:__ Navigate to "/" and see a basic splash page.
- [x] ??????: When logged in, "/" goes to home page
- [x] __20:__ See the name of the website on the splash page.
- [x] __20:__ See links to "Sign In" and "Sign Up" on the splash page.
- [x] __20:__ Sign up for an account with name, email, and password.
- [x] __20:__ Sign in to their account if they already have one.
- [x] __20:__ Be redirected to their public profile page after signing in (e.g. "/users/1").
- [x] __20:__ On their public profile page, see their name, email, and their join date.
- [x] __20:__ See the site-wide header on every page.
- [x] __20:__ See a link to "Profile" and "Sign Out" if they're logged in in the site-wide header.
- [x] __20:__ See links to "Sign In" and "Sign Up" if they're logged out in the site-wide header.

## Stage 2: Album Reviews

Allow users to see albums and leave reviews on them.

#### Requirements

**Users can...**

- [x] __20:__ View all albums on the home page (under "Records").
- [x] __20:__ View the most recent 3 reviews on the home page.
- [x] __20:__ Click on an album title to go to the album page (e.g. "/albums/1").
- [x] __20:__ See the site-wide header on the album page.
- [x] __20:__ See the name of the album on the album page.
- [x] __20:__ See all reviews for the album on album page sorted by newest first.
- [x] __20:__ Use an "Add review" button on the album page to pull up the new review form.
- [x] __20:__ Create a new review for an album using the new review form.
- [x] __20:__ See their created reviews on the album page.

**On the user's profile page, they can...**

- [x] __20:__ See their reviews sorted by newest first.
- [ ] __20:__ Click delete icon "trash can" on ANY individual review.
- [x] __20:__ See a pop-up that says: "Are you sure you want to delete this review?" when clicking trash can icon
- [ ] __20:__ Have the review deleted when confirming the pop-up.

## Stage 3: Validations & Authorization

Ensure that no invalid data gets saved to the database with validation. Also make sure that certain user actions are authorized.

#### Requirements

Users CANNOT save invalid data to the database. You don't need to show error messages to the user for the following.

- [ ] __30:__ Users CANNOT sign up with an email that is already in use.
- [ ] __30:__ A review's content must not be empty.

A user is authorized to perform certain actions on the site. You don't need to show error messages to the user for the following.

- [ ] __30:__ Only logged in users can create/destroy reviews.
- [ ] __30:__ Users may only delete their own reviews.

---
