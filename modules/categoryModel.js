const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "Category must be uniqe"],
      required: [true, "Category is required"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    image: String,
  },
  { timestamps: true }
);


const setImageUrl=(doc)=>{
  //return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

// work in get all data ,get specific data ,update data, delete
categorySchema.post("init", (doc) => {
 setImageUrl(doc)
});

//work in create data
categorySchema.post('save', (doc) => {
  setImageUrl(doc)
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
