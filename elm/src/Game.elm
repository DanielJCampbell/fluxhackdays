module Game exposing (..)

import Array exposing (Array)

import Timeline exposing (Timeline)
import Image exposing (Image)
import Position exposing (Position)
import Board exposing (Board)
import Token exposing (Token)
import Die exposing (Die)
import DiceGroup exposing (DiceGroup)
import Action exposing (Action)
import Field exposing (Field)
import Character exposing (Character)

type alias Game = {
  timeline: Timeline,
  board: Board,
  tokens: List Token,
  actionLibrary: Array Action,
  characterTemplates: Array Character
}

init: Game
init =
  let
    fields = Array.fromList [
      [Field "Maximum HP" (Field.FInt 6), Field "Current HP" (Field.FInt 6), Field "Level" (Field.FInt 1)],
      [Field "Maximum HP" (Field.FInt 10), Field "Current HP" (Field.FInt 10)],
      [Field "Maximum HP" (Field.FInt 6), Field "Current HP" (Field.FInt 1), Field "Level" (Field.FInt 1)],
      [Field "Maximum HP" (Field.FInt 10), Field "Current HP" (Field.FInt 2)]
    ]

    diceGroups = Array.fromList [
      [DiceGroup 1 6],
      [DiceGroup 1 8],
      [DiceGroup 1 10]
    ]

    actions = Array.fromList [
      Action 1 (Maybe.withDefault [] (Array.get 0 diceGroups)) "Attack - Crossbow" "Shoot a bolt up to 80ft, or 120ft with disadvantage",
      Action 2 (Maybe.withDefault [] (Array.get 1 diceGroups)) "Cantrip - Ray of Frost" "Shoot a bolt of cold up to 60 ft - deals cold damage",
      Action 3 (Maybe.withDefault [] (Array.get 2 diceGroups)) "Attack - Glamdring" "Melee attack with the elf-sword Glamdring"
    ]

    characters = Array.fromList [
      Character "Gandalf" (Maybe.withDefault [] (Array.get 0 fields)) [1, 2],
      Character "Goblin" (Maybe.withDefault [] (Array.get 1 fields)) [0],
      Character "Gandalf" (Maybe.withDefault [] (Array.get 2 fields)) [1, 2],
      Character "Goblin" (Maybe.withDefault [] (Array.get 3 fields)) [0]
    ]

    events = Array.fromList [
      [Timeline.RollEvent 20 7],
      [Timeline.RollEvent 20 18],
      [Timeline.RollEvent 20 14, Timeline.ActionEvent 3 5],
      [Timeline.RollEvent 20 19, Timeline.ActionEvent 2 8],
      [Timeline.RollEvent 20 3]
    ]

    turns = Array.fromList [
      Array.fromList [Timeline.Turn (Maybe.withDefault [] (Array.get 0 events)), Timeline.Turn (Maybe.withDefault [] (Array.get 1 events))],
      Array.fromList [Timeline.Turn (Maybe.withDefault [] (Array.get 2 events)), Timeline.Turn (Maybe.withDefault [] (Array.get 3 events))],
      Array.fromList [Timeline.Turn (Maybe.withDefault [] (Array.get 4 events))]
    ]

    defaultChar = Character "" [] []
    turnOrders = Array.fromList [
      Timeline.TurnOrder (Array.fromList [
        Maybe.withDefault defaultChar (Array.get 0 characters),
        Maybe.withDefault defaultChar (Array.get 1 characters)
      ]),
      Timeline.TurnOrder (Array.fromList [
        Maybe.withDefault defaultChar (Array.get 1 characters),
        Maybe.withDefault defaultChar (Array.get 2 characters)
      ]),
      Timeline.TurnOrder (Array.fromList [
        Maybe.withDefault defaultChar (Array.get 3 characters),
        Maybe.withDefault defaultChar (Array.get 2 characters)
      ])
    ]

    defaultOrder = Timeline.TurnOrder Array.empty
    defaultTurns = Array.empty
    rounds = Array.fromList [
      Timeline.Round (Maybe.withDefault defaultOrder (Array.get 0 turnOrders)) (Maybe.withDefault defaultTurns (Array.get 0 turns)) 1,
      Timeline.Round (Maybe.withDefault defaultOrder (Array.get 1 turnOrders)) (Maybe.withDefault defaultTurns (Array.get 1 turns)) 1,
      Timeline.Round (Maybe.withDefault defaultOrder (Array.get 2 turnOrders)) (Maybe.withDefault defaultTurns (Array.get 2 turns)) 1
    ]

    timeline = Timeline rounds 2
    board = Board (Image "assets/example_board.jpeg" 680 780)
    tokens = [
      Token (50, 50) (Image "assets/goblin_token.png" 40 40),
      Token (200, 50) (Image "assets/mage_token.png" 40 40)
    ]
  in
    Game timeline board tokens actions (Array.slice 0 2 characters)
