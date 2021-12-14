import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import useSound from 'use-sound';
import pieceSound from '../assets/piecesound.wav';
import { Helmet } from "react-helmet"
import { useNavigate } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Chess = require("chess.js");

function Game() {

    const navigate = useNavigate();
    const [play] = useSound(pieceSound);

    const [account1, setAccount1] = React.useState({ 'account': '', 'amount': '' })
    const [account2, setAccount2] = React.useState({ 'account': '', 'amount': '' })
    const [game, setGame] = useState();
    const [toPlay, setToPlay] = useState("White");
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
            if (move.color === "w")
                setToPlay("Black")
            else
                setToPlay("White")
        }

        setPosition(game.fen());
        if (game.game_over()) {
            gameOver(move)
            setToPlay("Over")
        }
    };

    const sendToAccount1 = async () => {
        const web3 = new window.Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        if (accounts[0] !== account2.account) {
            alert('Change to the other account from Metamask.')
            setTimeout(() => {
                sendToAccount1();
            }, 6900);
        }
        else {
            const res = await web3.eth.sendTransaction({ to: account1.account, from: account2.account, value: web3.utils.toWei(account2.amount) });
            if (res) {
                NotificationManager.success('Thanks for Playing!', 'Transaction Successful!')
                setTimeout(() => {
                    if (window.confirm('Navigating you to the Stake Page.'))
                        navigate("/stake")
                }, 2000);
            }
        }
    }

    const sendToAccount2 = async () => {
        const web3 = new window.Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        if (accounts[0] !== account1.account) {
            alert('Change to the other account from Metamask.')
            setTimeout(() => {
                sendToAccount2();
            }, 6900);
        }
        else {
            const res = await web3.eth.sendTransaction({ to: account2.account, from: account1.account, value: web3.utils.toWei(account1.amount) });
            if (res) {
                NotificationManager.success('Thanks for Playing!', 'Transaction Successful!')
                setTimeout(() => {
                    if (window.confirm('Navigating you to the Stake Page.'))
                        navigate("/stake")
                }, 2000);
            }
        }
    }

    const resign = () => {
        if (window.confirm(`${toPlay} - Are you sure to Resign?`)) {
            if (toPlay === "Black") {
                NotificationManager.success('White won by resignation.', 'Congratulations!');
                setTimeout(() => {
                    if (window.confirm(`${account2.account} will now be transferring ${account2.amount} Tokens to ${account1.account}`))
                        sendToAccount1();
                }, 2500);
            }
            else {
                NotificationManager.success('Black won by resignation.', 'Congratulations!');
                setTimeout(() => {
                    if (window.confirm(`${account1.account} will now be transferring ${account1.amount} Tokens to ${account2.account}`))
                        sendToAccount2();
                }, 3000);
            }
            setToPlay("Over")
        }
    }

    const gameOver = async (move) => {
        if (move.san[move.san.length - 1] === "#") {
            if (move.color === "w") {
                NotificationManager.success('White won by checkmate.', 'Congratulations!');
                setTimeout(() => {
                    if (window.confirm(`${account2.account} will now be transferring ${account2.amount} Tokens to ${account1.account}`))
                        sendToAccount1();
                }, 2500);
            }
            else {
                NotificationManager.success('Black won by checkmate.', 'Congratulations!');
                setTimeout(() => {
                    if (window.confirm(`${account1.account} will now be transferring ${account1.amount} Tokens to ${account2.account}`))
                        sendToAccount2();
                }, 3000);
            }
        }
        else {
            NotificationManager.success('The game ended in a draw.', 'Draw!');
        }
    }

    return (
        <div className="bg-bgcolor h-screen">
            <Helmet>
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
            </Helmet>
            <h1 className="text-4xl font-extrabold pt-10"><span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 filter drop-shadow hover:drop-shadow-lg">NOVELTY</span></h1><br />
            <div className="grid grid-cols-2 gap-4">
                <div className="mx-auto w-2/3">
                    <div className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 text-lg text-left my-2">
                        {account2.account} ({account2.amount})
                    </div>
                    <Chessboard position={position} onDrop={onDropMove} />
                    <div className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 text-lg text-left my-2">
                        {account1.account} ({account1.amount})
                    </div>
                </div>
                <div className="pt-6">
                    <div className="overflow-y-auto h-96 no-scrollbar mt-6 ml-28 bg-gray-900 mx-48">
                        <table className="table-auto border-collapse w-full">
                            <tbody className="text-sm font-normal text-slate-100">
                                {movesList[0][0] !== '' ? movesList.map((mov, index) =>
                                    mov[0] !== "" ?
                                        <tr className="hover:bg-slate-800 border-b border-slate-200 py-10">
                                            <td className="px-2 py-2">{index + 1}.</td>
                                            <td className="px-2 py-2">{mov[0]}</td>
                                            <td className="px-2 py-2">{mov[1]}</td>
                                        </tr>
                                        :
                                        <></>

                                ) : <div className="text-xl mt-4 text-slate-100">Moves will be displayed here</div>}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-16 mr-12">
                        <button onClick={resign} className="text-white text-lg font-medium rounded-xl px-16 py-3 bg-gradient-to-r from-amber-600 to-amber-300 hover:from-amber-700 hover:to-amber-500 hover:shadow-2xl">Resign</button>
                    </div>
                    <div className="mt-12 mr-12">
                        <div className="text-md mt-4 text-slate-500 hover:text-slate-400">{toPlay !== "Over" ? `${toPlay} To Play` : 'Game Over'}</div>
                    </div>
                </div>
            </div>
            <NotificationContainer />
        </div>
    );
}

export default Game;
