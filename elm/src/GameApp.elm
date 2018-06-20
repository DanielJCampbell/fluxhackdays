module GameApp exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes as Attributes exposing (..)
import Random
import Maybe
import Array exposing (Array)

import Id exposing (Id)
import Die exposing (Die)
import Action exposing (Action)
import Game exposing (Game)

main : Program Never Model Msg
main =
  Html.program {
    init = init,
    view = view,
    update = update,
    subscriptions = subscriptions
  }


-- MODEL

type alias Model = {
  dice: List Die,
  game: Game
}

init: (Model, Cmd Msg)
init =
  let
    initDice = [
      Die 1 2 2,
      Die 2 4 4,
      Die 3 6 6,
      Die 4 8 8,
      Die 5 10 10,
      Die 6 12 12,
      Die 7 20 20
    ]
  in
    (Model initDice Game.init, Cmd.none)


-- UPDATE

type Msg = Roll Die | SetDieRoll Id Int

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Roll die ->
      (model, Random.generate (SetDieRoll (.id die)) (Die.toGen die))
    SetDieRoll id value ->
      (setDieRoll model id value, Cmd.none)

setDieRoll: Model -> Id -> Int -> Model
setDieRoll model id res =
  { model | dice = Die.setRoll (.dice model) id res }


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

-- VIEW

view: Model -> Html Msg
view model =
  div [] [
    h1 [] [text "Dice Page"],
    viewDice (.dice model),
    br [] [],
    viewActions model (Array.toList (.actionLibrary (.game model)))
  ]

viewDice: List Die -> Html Msg
viewDice dice =
  div [] (List.map dieRow dice)

dieRow: Die -> Html Msg
dieRow die =
  let
    faces = toString (.faces die)
    currentFace = toString (.roll die)
  in
    div [] [
      div [] [
        button [onClick (Roll die)] [text ("Roll D" ++ faces)],
        text ("    Result: " ++ currentFace)
      ],
      br [] []
    ]

viewActions: Model -> List Action -> Html Msg
viewActions model actions =
  div [] (List.map (actionRow model) actions)

actionRow: Model -> Action -> Html Msg
actionRow model action =
  div [] [
    div [] [text (Action.toStr action)],
    br [] []
  ]
