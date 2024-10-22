const commands:any[] = []

// words
const {turn,on,the,light,off} = { turn: {turn:true,'switch':true} , on:{on:true},off:{off:true,of:true} , the:{the:true} , light:{light:true,bulb:true,lights:true}}
const {one,two,three} = {one:{on:true,one:true,ones:true,'1':true},two:{two:true,'2':true,to:true},three:{street:true,three:true,tree:true,'3':true}}
const {kitchen,dinning,park,door} = { kitchen:{kitchen: true} , dinning:{dinning: true},park:{park:true},door:{door:true,do:true}}
const {open,close} = {open:{open:true},close:{close:true}}
const {fan} = {fan:{fan:true}}
const {go,to,page,room} = { go:{go:true} , to:{to:true} , page:{page:true} ,room:{room: true}}



// light turn on turn off commands

const light1_on_1 = { name:"turn on the light one",words: [ turn , on , the , light ,one]}
const light1_on_2 = { name:"turn on the light one",words: [turn , on , dinning , light]}
const light1_off_1 = { name:"turn off the light one",words: [turn, off,the,light,one]}
const light1_off_2 = { name:"turn off the light one", words: [turn,off,dinning,light]}



const light2_on_1 = { name:"turn on the light two",words: [turn,on,the,light,two]}
const light2_on_2 = { name:"turn on the light two", words: [turn,on,kitchen,light ]}
const light2_off_1 = { name:"turn off the light two",words: [turn,off,the,light,two]}
const light2_off_2 = { name:"turn off the light two", words: [turn,off,kitchen,light ]}


const light3_on_1 = { name:"turn on the light three",words: [turn,on,the,light,three]}
const light3_on_2 = { name:"turn on the light three", words: [turn,on,park,light ]}
const light3_off_1 = { name:"turn off the light three",words: [turn,off,the,light,three]}
const light3_off_2 = { name:"turn off the light three", words: [turn,off,park,light ]}




//
const door1_on_1 = {name:"open the door one",words:[open,the,door,one]}
const door1_off_1 =  {name:"close the door one",words:[close,the,door,one]}

const door2_on_1 = {name:"open the door two",words:[open,the,door,two]}
const door2_off_1 =  {name:"close the door two",words:[close,the,door,two]}


const fan1_on_1 = {name:"turn on the fan one",words:[turn,on,the,fan,one]}
const fan1_off_1 =  {name:"turn off the fan one",words:[turn,off,the,fan,one]}




// Navigation
const door_page_1 = {name:"go to the doors page",words:[go,to,the,door,page]}
const light_page_1  = {name:"go to the lights page",words:[go,to,the,light,page]}
const fan_page_1 = {name:"go to the fan page",words:[go,to,the,fan,page]}
const room_1_page = {name:"go to the room 1",words:[go,to,the,room,one]}
const room_2_page = {name:"go to the room 2",words:[go,to,the,room,two]}

// lights
commands.push(light1_on_1,light1_on_2,light1_off_1,light1_off_2)
commands.push(light2_on_1,light2_on_2,light2_off_1,light2_off_2)
commands.push(light3_on_1,light3_on_2,light3_off_1,light3_off_2)

// doors
commands.push(door1_on_1,door1_off_1);
commands.push(door2_on_1,door2_off_1);

// fans
commands.push(fan1_on_1,fan1_off_1)

// navigation
commands.push(door_page_1)
commands.push(light_page_1)
commands.push(fan_page_1)
commands.push(room_1_page)
commands.push(room_2_page)

export function findCommand(phrase:string){
  const words = phrase.split(" ")
  let filteredCommands = commands.map(e => e)

  for(let i = 0 ;  i< words.length;i++){
    const word = words[i];
    let tempCommands = []
    for(let  j = 0 ; j < filteredCommands.length;j++){
      const command = filteredCommands[j]
      if(command.words.length >=  i && command.words[i][word]){
        tempCommands.push(command)
      }
    }
    // console.log(tempCommands)
    filteredCommands = tempCommands.map(e => e);
  }


  if(filteredCommands.length >0){
    return filteredCommands[0].name
  }

  return ""
}



