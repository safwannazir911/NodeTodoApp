import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import _ from "lodash";

const __dirname = dirname(fileURLToPath(import.meta.url)); // url->path(string)->dir
const app = express();


// mongoose.connect("mongodb://safwan123:123@127.0.0.1:27017/todoListDB", {
//   useNewUrlParser: true,
// });

mongoose.connect(
  "mongodb+srv://safwannazir911:Lexuslfa12345@cluster0.roxmicn.mongodb.net/todoListDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = new mongoose.Schema({
  taskName: String,
  checked: Boolean,
});
const listSchema = new mongoose.Schema({
  listName: String,
  items: [itemsSchema],
});

const Task = new mongoose.model("task", itemsSchema);
const List = new mongoose.model("list", listSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const currentDate = new Date();
const currentDay = currentDate.getDay();
const currentYear = currentDate.getFullYear();
const currentDateOfMonth = currentDate.getDate();
let dayName;

switch (currentDay) {
  case 0:
    dayName = "Sunday";
    break;
  case 1:
    dayName = "Monday";
    break;
  case 2:
    dayName = "Tuesday";
    break;
  case 3:
    dayName = "Wednesday";
    break;
  case 4:
    dayName = "Thursday";
    break;
  case 5:
    dayName = "Friday";
    break;
  case 6:
    dayName = "Saturday";
    break;
  default:
    dayName = "Unknown"; // Handle any unexpected values
}

app.get("/", (req, res) => {
  res.redirect("/category/today");
});

app.get("/category/:parms", async (req, res) => {
  try {
    const category = _.capitalize(req.params.parms);
    console.log(category);
    const list = await List.findOne({ listName: category });
    console.log(list);
    if (list!=null) {
      console.log(list.listName);
      res.render("index.ejs", {
        task: list.items,
        category: list.listName,
        day: dayName,
        date: currentDateOfMonth,
        year: currentYear,
      });
    } else {
      // Remove the second declaration of list
      const list = new List({
        listName: category,
        items: [],
      });
      await list.save();
      console.log(list.id + " List created");
      res.redirect(`/category/${category}`);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});





app.post("/submit", async (req, res) => {
  try {
    
    const name = req.body["task"];
    const category = req.body["category"];
    if(name===""){
      console.log("Enter name");
    }else{
      const task = new Task({
        taskName: name,
        checked: false,
      });
      await List.updateOne({ listName: category }, { $push: { items: task } });
    }
    res.redirect(`/category/${category}`);
  } catch (error) {
    console.error("Error:", error); // Log the actual error message
    res.status(500).send("An error occurred"); // Send an error response to the client
  }
});

app.post("/delete", async (req, res) => {
  try {
    const id = req.body["deleteId"];
    const category = req.body["category"];
    console.log(id + category);
    await List.updateOne(
      { listName: category }, // Updated the query to match the listName
      { $pull: { items: { _id: id } } } // Corrected the path to 'items' and added _id
    );
    res.redirect(`/category/${category}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("Listening...")
});