# Recipe Finder

Recipe Finder is a web application that allows users to discover and search for recipes based on available ingredients, dietary preferences, and other filters. It aims to make meal planning easier and more enjoyable by providing a wide range of recipes and customization options.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Search recipes by ingredient or keyword
- Filter recipes by dietary preferences (vegan, vegetarian, gluten-free, etc.)
- View detailed recipe instructions, ingredients, and nutritional information
- Save favorite recipes for quick access
- Responsive design for mobile and desktop
- User authentication (optional, if implemented)
- Integration with external recipe APIs

## Demo

![Home Page](./client/public/Screenshot%20(229).png)
![Search Page](./client/public/Screenshot%20(230).png)

[Live Demo](https://culinary-finder.vercel.app/)

## Technologies Used

- **Frontend:** React, TypeScript, CSS/SCSS, [UI Library, e.g., Material-UI or Bootstrap]
- **Backend:** Node.js, Express (if applicable)
- **API:** [e.g., Spoonacular API, Edamam API]
- **State Management:** Redux or Context API (if used)
- **Testing:** Jest, React Testing Library (if used)
- **Other:** Axios or Fetch for HTTP requests

## Getting Started

### Prerequisites

- Node.js (version X.X.X or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/recipe-finder.git
cd recipe-finder
npm install
```

### Running the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Configuration

Some features may require API keys (e.g., for external recipe APIs). Create a `.env` file in the root directory and add your keys:

```env
REACT_APP_RECIPE_API_KEY=your_api_key_here
```

Refer to the documentation of the API you are using for more details.

## Usage

1. **Search Recipes:** Enter ingredients or keywords in the search bar to find recipes.
2. **Apply Filters:** Use the filter options to narrow down results by dietary preferences.
3. **View Details:** Click on a recipe to see detailed instructions, ingredients, and nutrition facts.
4. **Save Favorites:** (If enabled) Click the "Save" button to add recipes to your favorites list.
5. **Authentication:** (If enabled) Sign up or log in to save your favorite recipes across devices.

## Folder Structure

- `src/` - Main source code
  - `components/` - React components
  - `pages/` - Page components
  - `services/` - API calls and utilities
  - `store/` - State management (if used)
  - `assets/` - Images and static files
- `public/` - Static assets

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

[MIT](LICENSE)

## Contact

For questions or feedback, please contact [tvarunesharasu@gmail.com](mailto:tvarunesharasu@gmail.com).
