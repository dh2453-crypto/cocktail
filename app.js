const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve CSS and other static files
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        error: null
    });
});

// Search for a cocktail
app.get("/search", async (req, res) => {
    const cocktailName = req.query.cocktail;

    if (!cocktailName || cocktailName.trim() === "") {
        return res.render("index", {
            error: "Please enter a cocktail name."
        });
    }

    try {
        const response = await axios.get(
            "https://www.thecocktaildb.com/api/json/v1/1/search.php",
            {
                params: {
                    s: cocktailName
                }
            }
        );

        const cocktails = response.data.drinks;

        if (!cocktails) {
            return res.render("index", {
                error: "Sorry, no cocktail was found. Try another name."
            });
        }

        res.render("result", {
            cocktails: cocktails,
            searchTerm: cocktailName
        });

    } catch (error) {
        console.error(error);

        res.render("index", {
            error: "There was a problem connecting to the CocktailDB API."
        });
    }
});

// Random cocktail
app.get("/random", async (req, res) => {
    try {
        const response = await axios.get(
            "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );

        const cocktails = response.data.drinks;

        res.render("result", {
            cocktails: cocktails,
            searchTerm: "Random Cocktail"
        });

    } catch (error) {
        console.error(error);

        res.render("index", {
            error: "Unable to get a random cocktail right now."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Cocktail Finder is running at http://localhost:${PORT}`
    );
});