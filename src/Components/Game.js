import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import useSound from 'use-sound';
import pieceSound from '../assets/piecesound.wav';

const Chess = require("chess.js");

function Game() {

    const [play] = useSound(pieceSound);

    const [account1, setAccount1] = React.useState({ 'account': '', 'amount': '' })
    const [account2, setAccount2] = React.useState({ 'account': '', 'amount': '' })
    const [game, setGame] = useState();
    const [movesList, setMovesList] = useState([["", ""]]);
    const [totalMoves, setTotalMoves] = useState(0);

    useEffect(() => {
        setGame(new Chess())
        setAccount1({ 'account': localStorage.getItem('account1'), 'amount': localStorage.getItem('account1amount') })
        setAccount2({ 'account': localStorage.getItem('account2'), 'amount': localStorage.getItem('account2amount') })
    }, [])

    const [position, setPosition] = useState("start");

    const onDropMove = ({ sourceSquare, targetSquare }) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        if (move === null) return;
        else {
            play();
            let tempList = movesList
            if (move.color === "w") {
                tempList[totalMoves][0] = move.san;
            }
            else {
                tempList[totalMoves][1] = move.san;
                tempList.push(["", ""]);
                setTotalMoves(totalMoves + 1)
            }
            setMovesList(tempList);
        }
        console.log(move)

        setPosition(game.fen());
        if (game.game_over())
            gameOver(move)
    };

    const gameOver = (move) => {
        console.log(move.san[move.san.length - 1])
    }

    return (
        <div className="bg-bgcolor h-screen">
            <h1 className="text-4xl font-extrabold pt-10"><span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 filter drop-shadow hover:drop-shadow-lg">NOVELTY</span></h1><br />
            <div className="grid grid-cols-2 gap-4">
                <div className="pt-8 mx-auto w-2/3">
                    <Chessboard position={position} onDrop={onDropMove} />
                </div>
                <div className="pt-6">
                    <div className="col-span-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 text-xl my-2 hover:shadow-2xl">
                        {account1.account} - {account1.amount} (WHITE)
                    </div>
                    <div className="col-span-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 text-3xl hover:shadow-2xl">
                        VS
                    </div>
                    <div className="col-span-2 bg-clip-text  text-transparent bg-gradient-to-r from-amber-500 to-amber-300 text-xl my-2 hover:shadow-2xl">
                        {account2.account} - {account2.amount} (BLACK)
                    </div>
                    <div className="overflow-y-auto max-h-96 no-scrollbar mt-10 ml-20">
                        <table className="table-auto border-collapse ml-32 w-1/2">
                            <tbody className="text-sm font-normal text-slate-100">
                                {movesList ? movesList.map((mov, index) =>
                                    mov[0] !== "" ?
                                        <tr className="hover:bg-slate-900 border-b border-slate-200 py-10">
                                            <td className="px-2 py-2">{index + 1}.</td>
                                            <td className="px-2 py-2">{mov[0]}</td>
                                            <td className="px-2 py-2">{mov[1]}</td>
                                        </tr>
                                        :
                                        <></>

                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
