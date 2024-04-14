const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory must be uniqe"],
      required: [true, "subCategory is required"],
      minlength: [3, "Too shory subCategory name"],
      maxlength: [32, "Too long subCategory name"],
    },
    image: String,
    category:{
      type:mongoose.Schema.ObjectId,
      ref:"Category",
      required:[true,"subCategory must be belong to parent category"]
    },
  },
  { timestamps: true }
);


const setImageUrl=(doc)=>{
  //return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/subCategory/${doc.image}`;
    doc.image = imageUrl;
  }
}

// work in get all data ,get specific data ,update data, delete
subCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name image -_id" });
  next();
});
// work in get all data ,get specific data ,update data, delete
subCategorySchema.post("init", (doc) => {
 setImageUrl(doc)
});

//work in create data
subCategorySchema.post('save', (doc) => {
  setImageUrl(doc)
});

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
