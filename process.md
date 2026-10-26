## Project structure and component decisions

This project is a frontend shell built with React, TypeScript, and Next.js.

### Data model

The car data model is defined in `app/types/car.js`, and the car data is stored in `app/data/cars.ts`. This separates the data structure and content from the components that display them.

### Components

I created two components: `Button` and `Card`.

The `Button` component is currently used only as an icon-only button within the cards. But we can potentially expand that in the future for further use cases.

`Card` is the main component for presenting car information. It defines the card’s structure and accepts "props"(I mistaken it with "children"), allowing the page to populate the fields with car data when rendering each card.

Because the Car type is defined in car.ts, I don't actually have to redefine every field in the card component again, but instead jsut import the Car types, and use car.props to fill in the specific fields. That actually makes the code cleaner.

A note to myself: children is the prop that holds nested content. That's why I confused it with the concept of prop, cos they do have similarities.

### Page rendering

The `page.tsx` file brings these pieces together and renders the cards on the page.

### The .map method myth

To create the list, I first used `.map()` to iterate over the car data and render a `Card` component for each item. This avoids manually repeating the component markup and lets the list reflect changes to the data.

"        <div className="max-w-6xl grid grid-cols-5 flex-1 items-center">
        {cars.map((item) => (
          <Card key={item.id} brand={item.brand} model={item.model} year={item.year} price={item.price} description={item.description} image={item.image} />
        ))}"

However, I was still a bit confused about how .map method actually works, because to me, the .map method seems to be doing 2 things simutaneously:

1. mapping out all the cars in the cars.ts
2. render them into the cards.

 I feel uncomfortable over this sealed logic, so I decide to ask AI to unseal this method for me. So instead, I used a 'for' loop and .push method to rebuild the same logic, so that I can now speak with confidence how this .map method actually works.

### Understanding image references

I initially struggled to understand how an image reference becomes a rendered image and what data type it should have in TypeScript.

Eventually, I understood that, in this project, the image reference is simply a string containing the path to a publicly accessible image file. The string identifies the image’s location; the image element or component uses that path to display it.

### Scope and future improvements

I have not added pagination because the current dataset contains only around eleven cars. I would like to explore pagination in a future tutorial, once the project has a more developed backend and database.

I did't not create the car detail page, as I think that is also not in the scope of this current session.

### Development process and AI assistance

I wrote the application code myself in Cursor and defined the car data model myself. When I encountered unfamiliar concepts, I used Cursor’s AI in Ask mode to ask questions and improve my understanding.

I used AI to generate the global CSS and the sample car records based on my data model. This saved me from manually defining every color and shared style or writing repetitive data entries.

----------------------------------------------------------------

### Task 2

### Planning of the filtering feature

What comes into my mind immediately is a search bar and a dropdown menu as filter. The search bar is for a direct matching of key words. The filter can filter the cars in display by different features available in the data type.

On the primise that we're displaying all the car data in the page.tsx, no API connection required, I think it's better to do the filtering logic right in page.tsx. When we have more car available, we might need things like pagination, a search and filtering API etc.

### The actual coding of the filtering feature

I added a search bar, to search any traits of the car data type, including the brand, the model, and the year.
I also added a brand filter which filters the cars by brand only. I could add the model and year filter, and even add a price slider, but think that's just not 100% for the purpose of this task.

To make the feature look decent, I also added a .length to the page, so that when filtered, we can also easily find out how many cars are left after filtering. Same I added an empty state.

### The learning during the coding of this feature

The part that was most struggling for me is not the useState logic, which I have actually had some understanding before. What I struggled most at first is the default HTML Attributes of dropdown and input, e.g. the onChange method, the <option> item. Once I figure out how the components work in HTML logic, things get easier for me to understand.

So how does the whole filtering work?

user input the data/select the option, the HTML captures these changes, and pass them down to the component. The component then pass down that new change/event to the page.tsx, and then call useState to update the actual page. 
Meanwhile, in parallel, the .map method captures the event change from the input and dropdown, to update the carList that is rendered.

What I think is quite elegant for the current code:
  1. the filteredCars method collects all the filtering logic within 1 variable, nesting both the search and dropdown filtering logic.
  2. the filteredCars method is then passed down to the .map method, and all the carList changes are rendered. Regardless of it coming from the input or the dropdown.
  3. it's interesting to learn about:
    A. a series of default JS method: 
      .filter; 
      .toLowerCase(); 
      .includes();
    B. the ?...: grammar, as an replacement of if...else. I tried to use if...else in the <div/>, and turns out it doesn't work as I expected. So the ?...: grammar is better for when nested in a <div/>
    C. a new usecase of .map: ```options={cars.map((carsData) => carsData.brand)}``` it is used here to render a new array list of brands to be rendered in the dropdown option. I was struggling with how to render a brand list in the dropdown, turns out .map could do this easily.
    D. for the <select/> it automatically renders the .option and .target logic, without needing to write an onClick, which is not clear at first sight at all...

I used AI the same way as I did last time.

lint and build checked, except for the old Next.js image issue, nothing else.