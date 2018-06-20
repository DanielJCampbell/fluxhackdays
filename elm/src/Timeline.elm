module Timeline exposing (..)

import Array exposing (Array)

import Id exposing (Id)
import Action exposing (Action)
import Character exposing (Character)

type alias Timeline = {
  rounds: Array Round,
  current: Int
}

type alias Round = {
  order: TurnOrder,
  turns: Array Turn,
  current: Int
}

type alias TurnOrder = {
  characters: Array Character
}

type alias Turn = {
  events: List Event
}

type Event = ActionEvent Id Int | RollEvent Int Int