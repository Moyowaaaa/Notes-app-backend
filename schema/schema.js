const Note = require("../models/notes");
// const Content = require('../models/content');
const Folder = require("../models/folder")
const Todo = require("../models/todo");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const folder = require("../models/folder");

const FolderType = new GraphQLObjectType({
    name: 'Folder',
    fields: () => ({
        id: {type: GraphQLID},
        name: { type: GraphQLString },
        note:{
            type: new GraphQLList(NoteType),
            resolve(parent, args){
                return Note.find({folderId: parent.id})
            }
        }
    })
})



const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    tag:{type:GraphQLString},
    folder:{
        type:FolderType,
        resolve(parent,args){
            return Folder.findById(parent.folder)
        }
    }
    // type:{type: GraphQLString},
  }),
});

const SketchType = new GraphQLObjectType({
  name: "Sketch",
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
  }),
} 
);

//Get todo
const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
  }),
}
);



const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {

//all notes
 notes:{
      type: new GraphQLList(NoteType),
      folder:{
        type:FolderType,
        resolve(parent,args){
            return Folder.findById(parent.folder)
        },
      },
      resolve(parent, args) {
        return Note.find({})
      }
 },


 //single note
 note:{
      type: NoteType,
      args: {
        id: { type: GraphQLID }
      },
      


      resolve(parent, args) {
        return Note.findById(args.id)
      }
 },


 //all folders

  folders:{
      type: new GraphQLList(FolderType),
      resolve(parent, args) {
        return Folder.find({})
      }
    },


    //single folder
    folder:{
      type: FolderType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Folder.findById(args.id)
      }
    },
    
    //get sketch
    sketch:{
      type: SketchType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Sketch.findById(args.id)
      }
    },

    //get Todos

    todos:{
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        return Todo.find()
      }
    },


 
  },
});


const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {

      //create Folder

      createFolder:{
        type: FolderType,
        args: {
            name: {
              type: new GraphQLNonNull(GraphQLString),
            defaultValue: "New Folder"
            }
        }, 
        resolve(parent,args){
            let folder = new Folder({
                name: args.name
            })
            return folder.save()
        }

      },

      //Update Folder
      updateFolder:{
        type: FolderType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString }
        },
        resolve(parent,args){
            return Folder.findByIdAndUpdate(args.id,{
                $set: {
                    name: args.name
                }
            },{new: true})
        }
      },

      //Delete Folder
      deleteFolder:{
        type: FolderType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) }
        }, 
        resolve(parent,args){
            Note.find({folderId: args.id}).then(notes => {
                notes.forEach(note => {
                    note.remove()
                }
                )
            }
            )
            return Folder.findByIdAndRemove(args.id)
        }
      },

        //add Note 
        addNote:{
            type: NoteType,
            args: {
                title: { 
                    type: new GraphQLNonNull(GraphQLString) ,
                    defaultValue: "New Note"
                },
                body: { type: GraphQLString,
                defaultValue: "New Note"
                },
                tag: { type: GraphQLString },
            },
            resolve(parent, args) {
                let note = new Note({
                    title: args.title,
                    body: args.body,
                    tag: args.tag
                });
                return note.save();
            }
        },


        //Create Note in Folder
        createNoteInFolder:{
            type: FolderType,
            args: {
              title: { type: new GraphQLNonNull(GraphQLString) ,
                defaultValue: "New Note"},
              body: { type: GraphQLString },
              folderId: { type: new GraphQLNonNull(GraphQLID) },
              tag: { type: GraphQLString },
            },
            resolve(parent, args) {
                let note = new Note({
                    title: args.title,
                    body: args.body,
                    folderId: args.folderId,
                    tag: args.tag
                });
                return note.save();
            }
        },
              

           //updateNote
    updateNote: {
        type: NoteType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          title: { type: GraphQLString },
          body: { type: GraphQLString },
          tag: { type: GraphQLString },
        },
        resolve(parent, args) {
          return Note.findByIdAndUpdate(
            args.id,
            { $set: { title: args.title, body: args.body, tag: args.tag } 

          },
            { new: true }
          );
        },
      },
  
  
  
  
  
      //Delete Note
      deleteNote: {
        type: NoteType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve(parent, args) {
          return Note.findByIdAndRemove(args.id);
        },
      },


      //createSketch

      createSketch:{
        type: SketchType,
        args: {
            text:{type:GraphQLString},
        },
        resolve(parent,args){
            let sketch = new Sketch({
                text: args.text
            })
            return sketch.save()
        }
      },

       //create Todo
  createTodo:{
    type: TodoType,
    args: {
      text: { type: GraphQLString }
    },
    resolve(parent, args) {
      let todo = new Todo({
        text: args.text
      });
      return todo.save();
    }
  },


  //delete Todo
  deleteTodo:{
    type: TodoType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, args) {
      return Todo.findByIdAndRemove(args.id);
    }
  },



     
        
    }
        });




module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
