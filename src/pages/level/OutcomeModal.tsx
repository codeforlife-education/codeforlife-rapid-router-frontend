import { Box, Button, Stack, Typography } from "@mui/material"
import { type FC, useEffect, useState } from "react"
import { Link } from "react-router"

import { useAppDispatch, usePhaserGameContext } from "../../app/hooks"
import CoinGoldSvg from "../../images/coins/coin_gold.svg"
import type { Level } from "../../api/level"
import LevelModal from "./LevelModal"
import type { LevelResultFailure } from "../../phaser"
import { PLACEHOLDER_HINT } from "./HintModal"
import type { TilemapGroup } from "../../phaser/tilemaps"
import { paths } from "../../routes"
import { setGameCommands } from "../../app/slices"

// TODO: Replace with the real scoring algorithm.
const ROUTE_SCORE = { score: 10, maxScore: 10 }
const ALGORITHM_SCORE = { score: 10, maxScore: 10 }

/** What to tell the player about why the level wasn't completed - the
 * legacy game's messages. */
function failureMessage(failure: LevelResultFailure): string {
  switch (failure.reason) {
    case "out_of_instructions":
      return "The van ran out of instructions before it reached a destination. Make sure there are enough instructions to complete the delivery."
    case "visited_but_did_not_stop":
      return "The van visited the destination, but didn't stop there!"
    case "start_disconnected":
      return "Make sure your blocks are connected to the Start block."
    case "off_road":
      return failure.correctMoves === 0
        ? "Your first move was a crash. What went wrong?"
        : failure.correctMoves === 1
          ? "Your first move was right. What went wrong after that?"
          : `Your first ${failure.correctMoves} moves worked. What went wrong after that?`
    case "animal":
      return failure.animal === "PIGEON"
        ? "You ran into a pigeon!"
        : "You ran into a cow!"
    case "red_light":
      return "Uh oh, you just sent the van through a red light! Stick to the Highway Code - the van must wait for green."
    case "out_of_fuel":
      return "You ran out of fuel! Try to find a shorter route to the destination."
    case "undelivered_destinations":
      return "There are destinations that have not been delivered to. Ensure you visit all destinations and use the deliver command at each one."
    case "delivered_to_non_destination":
      return "You tried to deliver to a destination that doesn't exist."
    case "already_delivered":
      return "You have already delivered to that destination! You must only deliver once to each destination."
    case "program_error":
      return "Your program doesn't look quite right..."
  }
}

/** The path to the level after `id` in the same group, if there is one. */
function nextLevelPath(id: number, tilemapGroup?: TilemapGroup) {
  if (!tilemapGroup) return undefined
  const ids = paths[tilemapGroup].level.id as unknown as Record<
    number,
    { _: string } | undefined
  >
  return ids[id + 1]?._
}

const Score: FC<{ label: string; score: number; maxScore: number }> = ({
  label,
  score,
  maxScore,
}) => (
  <>
    <Typography sx={{ mb: 0 }}>{label}</Typography>
    <Stack
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap", alignItems: "center", gap: 0.5, mb: 1 }}
    >
      {Array.from({ length: maxScore }, (_, i) => (
        <Box
          key={i}
          component="img"
          src={CoinGoldSvg}
          alt={i < score ? "Coin" : "Missing coin"}
          sx={{ width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 } }}
        />
      ))}
      <Typography component="span" sx={{ mb: 0, ml: 0.5 }}>
        {`${score}/${maxScore}`}
      </Typography>
    </Stack>
  </>
)

export interface OutcomeModalProps {
  level: Pick<Level, "id" | "hint"> & { tilemapGroup?: TilemapGroup }
}

/** Tells the player how their run went once it's over: a win, with their
 * score, or what went wrong. */
const OutcomeModal: FC<OutcomeModalProps> = ({ level }) => {
  const dispatch = useAppDispatch()
  const { levelResult, setLevelResult } = usePhaserGameContext()
  const [hintShown, setHintShown] = useState(false)

  // Hide the hint again for each new result.
  useEffect(() => setHintShown(false), [levelResult])

  if (!levelResult) return null
  const close = () => setLevelResult?.(undefined)

  if (levelResult.success) {
    const nextPath = nextLevelPath(level.id, level.tilemapGroup)
    const score = ROUTE_SCORE.score + ALGORITHM_SCORE.score
    const maxScore = ROUTE_SCORE.maxScore + ALGORITHM_SCORE.maxScore

    return (
      <LevelModal
        open
        onClose={close}
        title="You win!"
        actions={
          nextPath ? (
            <Button
              component={Link}
              to={nextPath}
              onClick={() => {
                close()
                // Don't carry this level's program over to the next one.
                dispatch(setGameCommands([]))
              }}
            >
              Next level
            </Button>
          ) : (
            <Button onClick={close}>Close</Button>
          )
        }
      >
        <Score label="Route score:" {...ROUTE_SCORE} />
        <Score label="Algorithm score:" {...ALGORITHM_SCORE} />
        <Typography>{`Your total score: ${score}/${maxScore}`}</Typography>
        <Typography>{"Congratulations! You've aced it."}</Typography>
      </LevelModal>
    )
  }

  // A broken program isn't something a hint can help with.
  if (levelResult.reason === "program_error") {
    return (
      <LevelModal
        open
        onClose={close}
        title="Oh dear!"
        actions={<Button onClick={close}>Close</Button>}
      >
        <Typography>{failureMessage(levelResult)}</Typography>
        <Typography>{levelResult.message}</Typography>
      </LevelModal>
    )
  }

  return (
    <LevelModal
      open
      onClose={close}
      title="Oh dear!"
      actions={
        <>
          <Button onClick={close}>Try again</Button>
          {!hintShown && (
            <Button onClick={() => setHintShown(true)}>Show hint</Button>
          )}
        </>
      }
    >
      <Typography>{failureMessage(levelResult)}</Typography>
      {hintShown && <Typography>{level.hint || PLACEHOLDER_HINT}</Typography>}
    </LevelModal>
  )
}

export default OutcomeModal
