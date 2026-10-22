## Project structure and component decisions

This project is a frontend shell built with React, TypeScript, and Next.js.

### Data model

The car data model is defined in `app/types/car.js`, and the car data is stored in `app/data/cars.ts`. This separates the data structure and content from the components that display them.

### Components

I created two components: `Button` and `Card`.

The `Button` component is currently used only as an icon-only button within the cards. But we can potentially expand that in the future for further use cases.

`Card` is the main component for presenting car information. It defines the card’s structure and accepts children, allowing the page to populate those children with car data when rendering each card.

Although `Card` does not import `cars.ts` directly, I still needed to align its child content with the corresponding fields in the car data model. The page imports the data and supplies those field values as the card’s child content.

I'm actually curious whether there're better ways to do it.

### Page rendering

The `page.tsx` file brings these pieces together and renders the cards on the page.

To create the list, I use `.map()` to iterate over the car data and render a `Card` component for each item. This avoids manually repeating the component markup and lets the list reflect changes to the data.

I also learned that I do not need to extract every property into a separate variable upfront. Inside `.map()`, I can work with each car as a complete object and access its individual properties wherever they are needed in the card’s JSX. This is about accessing object properties during rendering, rather than importing each property separately.

### Understanding image references

I initially struggled to understand how an image reference becomes a rendered image and what data type it should have in TypeScript.

Eventually, I understood that, in this project, the image reference is simply a string containing the path to a publicly accessible image file. The string identifies the image’s location; the image element or component uses that path to display it.

### Scope and future improvements

I have not added pagination because the current dataset contains only around eleven cars. I would like to explore pagination in a future tutorial, once the project has a more developed backend and database.

I did't not create the car detail page, as I think that is also not in the scope of this current session.

### Development process and AI assistance

I wrote the application code myself in Cursor and defined the car data model myself. When I encountered unfamiliar concepts, I used Cursor’s AI in Ask mode to ask questions and improve my understanding.

I used AI to generate the global CSS and the sample car records based on my data model. This saved me from manually defining every color and shared style or writing repetitive data entries.