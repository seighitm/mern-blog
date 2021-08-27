const mongoose = require('mongoose');

const schema = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String},
        image: {type: String},
        creator: {type: String, required: true},
        likes: {type: [String], default: []},
    },
    {timestamps: true}
);

schema.method("toJSON", function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("posts", schema);
