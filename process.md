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

# Task 2

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


----------------------------------------------------------------

# Task 3

### Initial plan, and what I changed

The plan was to keep the UI as it was, move the car list onto a small Express API, and have `page.tsx` load cars over HTTP instead of importing `apps/web/src/app/data/cars.ts`.

I kept that plan. What I changed along the way:
1. I split the repo into different workspaces (`apps/web`, `apps/api`, `packages/types`) instead of leaving everything under one Next.js app.
2. I moved the `Car` type into `packages/types/car.ts` so both apps import the same shape. Path alias: `@/packages/types/car`.
3. `/cars/:id` first returned a missing car as `200` with `{}` or `car: null`. I changed it to `404` with `{ status: "error", message }`.
4. The first frontend fetch only stored `cars`. Failed requests looked like an empty list "{ }" . I changed that to a `CarsRequest` union: loading / error / success.
5. Search and brand filter stayed on the client. I did not add a search API.
I kept the backend small on purpose: three GET routes, one data file, no database, no router folder.

### Decisions
**Backend files.** One Express entry file and one data file:
- `apps/api/src/index.ts` — CORS, JSON parser, routes, listen on 4000
- `apps/api/src/app/data/cars.ts` — the array type car data
I did not add controllers or a routes folder. Three endpoints do not need that.
**JSON responses.**
- `GET /health` → `{ ok: true }`
- `GET /cars` → `{ cars: [...] }`
- `GET /cars/:id` success → `{ status: "success", car }`
- `GET /cars/:id` missing → `404` `{ status: "error", message: "Car with id … not found" }`
List and detail are not identical. The list is the homepage payload. Detail uses `status` so a missing id is obvious in curl and in a future detail page.

**Where fetching lives.** In `apps/web/src/app/page.tsx` only. `loadCars` is a `useCallback`. `useEffect` runs it on demand. Cards, Input, and Dropdown stay as it was. No extra API client file.

**Loading and error state.** One `request` state, with 3 variants, not 3 booleans, because the 3 states here are mutually exclusive, and it's hard to reflect the mutually exclusive logic with booleans:

```ts
type CarsRequest =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; cars: Car[] };
```

- loading → “Loading cars…”
- error → message + Try again (calls `loadCars` again)
- success + no matches after filter → “No cars found”
- success + `data.cars ?? []` so a missing `cars` field is an empty list, not a crash
Filter state (`search`, `brand`) is separate from request state.

**API address.** Hardcoded `http://localhost:4000` in `page.tsx`, port `4000` in `index.ts`, CORS origin `http://localhost:3000`. No `.env`. If a port changes, those three places have to change together. That is enough for local homework.

### How a request moves from the frontend to Express and back
1. The browser opens `http://localhost:3000`. Next.js serves the page.
2. `useEffect` runs `loadCars`.
3. `loadCars` sets `request` to loading, then `fetch("http://localhost:4000/cars")`.
4. The browser sends a GET to Express on 4000. Origin is `http://localhost:3000`, so CORS must allow that origin or the browser blocks the response.
5. Express matches `GET /cars`, reads the in-memory `cars` array, and `res.json({ cars })`.
6. `fetch` gets the Response. If `!res.ok`, throw. Otherwise parse JSON and `setRequest({ status: "success", cars })`.
7. Network failure (API stopped) goes to `.catch` and `status: "error"`.
8. React re-renders. Search/brand `.filter` still runs only on the success list.
`GET /cars/:id` is the same path, but `req.params.id` + `cars.find`. The homepage does not call it yet. I checked it with curl.

### Loading, errors, and empty data
| Case | What happens |
| --- | --- |
| First load / retry | `status: "loading"`, copy “Loading cars…” |
| API down or HTTP error | `status: "error"`, message, Try again |
| List arrives | `status: "success"`, cards + count |
| Success but filters match nothing | same success state, “No cars found” |
| Unknown id on `/cars/:id` | 404 JSON, not an empty 200 |
Empty filter results are not treated as a fetch error. The request succeeded; the client filter is just strict.

### What I found difficult
1. I never knew the monorepo with both API and Web workspace architecture before. It took me a while to figure out what it is and how that works.
2. It also took me a while to figure our the tsconfig across different workspaces.
    
    To share the `Car` type. The API `tsconfig` `paths` alias was wrong at first (`baseUrl` / too many `../`). Web already used `../../packages/types/car.ts`. Matching that, and dropping `rootDir` so a file outside `apps/api/src` is allowed, made the import work.
3. I was also a bit struggle on how to set up different states in the frontend, from loading to error to empty etc.
4. Also this task purely has more new knowledge for me compared with previous ones: with API, Portal, CORS, HTTPS, Req/Res, Listen, etc. I took some time to figure out how all the pieces come together.

### Checks I performed
- `npm install` at the repo root, then `npm run dev` (web 3000 + api 4000 via concurrently).
- Browser: catalog loads from the API; search and brand filter still work; empty filter copy still shows.
- Stop the API / fail `/cars`: error UI and Try again. Start the API again: retry works.
- curl:
  - `curl http://localhost:4000/health` → `{ "ok": true }`
  - `curl http://localhost:4000/cars` → list
  - `curl http://localhost:4000/cars/1` → one car
  - `curl -i http://localhost:4000/cars/999` → `404` and `{ "status": "error", "message": "Car with id 999 not found" }`
- Frontend lint/build: 
    1. same Next.js image warning as before
    2. `npx eslint src` in `apps/web` reports `react-hooks/set-state-in-effect` on `page.tsx`:
      `useEffect` calls `loadCars()`, and `loadCars` immediately does `setRequest({ status: "loading" })`. The rule does not like `setState` at the start of an effect, because it causes an extra render.
      
      After investigation, I understand the warning. I did not change the code. The page already starts as `{ status: "loading" }`, and `loadCars` is also used by **Try again**, so I want one function for first load and retry. And this approach also keeps all the status from loading to error etc in one type function, so things are cleaner.
      
### AI use
I used Cursor AI in Ask mode, same as Task 1 and 2. I wrote the Express routes, moved the data, and wired `fetch` myself.
AI helped with:
- Express + CORS setup
- why `fetch` needs `res.ok`
- the loading / error / success union instead of one `cars` array
- `tsconfig` `paths` for `@/packages/types/car`
- curl commands to prove 404
How I checked suggestions: I did not paste blindly. I ran the server, used curl (`-i` for status codes), reloaded the browser, stopped port 4000 to see the error UI, then started the API again and used Try again.
