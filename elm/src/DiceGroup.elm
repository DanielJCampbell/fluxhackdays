module DiceGroup exposing (..)

import Random

import Die exposing (Die)
import Id exposing (Id)

type alias DiceGroup = {
  count: Int,
  faces: Int
}

newFromDice: List Die -> DiceGroup
newFromDice dice =
  let
    defaultDie = Die -1 6 1
    firstDie = Maybe.withDefault defaultDie (List.head dice)
  in
    if (List.isEmpty dice) then
      DiceGroup 1 6
    else
      DiceGroup (List.length dice) (.faces firstDie)

toGen: DiceGroup -> Random.Generator(Int)
toGen diceGroup =
  let
    listGen = Random.list (.count diceGroup) (Random.int 1 (.faces diceGroup))
  in
    Random.map List.sum listGen

toDice: DiceGroup -> Id -> List Die
toDice diceGroup startId =
  let
    diceList = List.repeat (.count diceGroup) (Die -1 (.faces diceGroup) 1)
  in
    List.indexedMap (\index die -> { die | id = (startId + index) }) diceList

-- LIST METHODS

listToDice: List DiceGroup -> Id -> List Die
listToDice diceGroups startId =
  let
    first = Maybe.withDefault (DiceGroup 1 6) (List.head diceGroups)
    rest = Maybe.withDefault [] (List.tail diceGroups)
  in
    if (List.isEmpty diceGroups) then
      []
    else
      List.append (toDice first startId) (listToDice rest (startId + (.count first)))
