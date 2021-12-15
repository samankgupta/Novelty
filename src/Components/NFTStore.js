import React from "react";
import { useNavigate } from 'react-router-dom';
import { Web3Storage } from 'web3.storage'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Stake = () => {

    const navigate = useNavigate();

    const [gamesList, setGamesList] = React.useState([])

    React.useEffect(() => {
        test();
    }, [])

    function makeStorageClient() {
        return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmODc2ZDA3OTE1ZUQ2ODA3NmFhYzU3YzBhMDZlYzgwODUyNDk4QUYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mzk1NTM2OTU3NjIsIm5hbWUiOiJub3ZlbHR5In0.NgSw8KJSdxahiHYLVcWs9x5p6t_hqv-EFlkznuyAByM" })
    }

    async function listUploads() {
        const client = makeStorageClient()
        for await (const upload of client.list()) {
            console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`)
        }
    }

    const test = async () => {

        const client = makeStorageClient()
        let newestFile = ""
        const maxResults = 1

        for await (const upload of client.list({ maxResults })) {
            newestFile = upload.cid
        }

        fetch(`https://${newestFile}.ipfs.dweb.link/games.json`)
            .then(response => response.json())
            .then(data => setGamesList(data));
    }
    console.log(gamesList)

    return (
        <div className="bg-bgcolor min-h-screen">
            {gamesList.length > 0 ?
                <>
                    <h1 onClick={() => navigate('/')} className="text-4xl font-extrabold pt-10"><span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 filter drop-shadow hover:drop-shadow-lg">NOVELTY - NFT STORE</span></h1><br />
                    <table className="table-auto border-collapse w-full my-6">
                        <tbody className="text-md font-normal text-white">
                            <tr className="border-b border-slate-200 py-10">
                                <th className="px-2 py-2">S. No.</th>
                                <th className="px-2 py-2">Players</th>
                                <th className="px-2 py-2">Location</th>
                                <th className="px-2 py-2">NFT Price</th>
                                <th className="px-2 py-2">Owned By</th>
                                <th className="px-2 py-2">Buy</th>
                            </tr>
                            {gamesList.length > 0 ? gamesList.map((game, index) =>
                                <tr className="hover:bg-slate-800 border-b border-slate-200 py-10" onClick={() => window.open(game.url, "_blank")}>
                                    <td className="px-2 py-2">{index + 1}</td>
                                    <td className="px-2 py-2">{game.name}</td>
                                    <td className="px-2 py-2">{game.place}</td>
                                    <td className="px-2 py-2">{game.price}</td>
                                    <td className="px-2 py-2">0xFE41bEcF3017775cA14E74bd778c2b13a5C67649</td>
                                    <td className="px-2 py-2">
                                        <button className="text-white text-lg font-medium rounded-xl px-8 py-2 bg-gradient-to-r from-amber-600 to-amber-300 hover:from-amber-700 hover:to-amber-500 hover:shadow-2xl">Buy</button>
                                    </td>
                                </tr>
                            ) : <></>}
                        </tbody>
                    </table>
                </>
                :
                <div className="flex h-screen">
                    <div class="m-auto">
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 filter drop-shadow hover:drop-shadow-lg pb-8 animate-pulse">Loading NFT Store...</h1>
                    </div>
                </div>
            }
            <NotificationContainer />
        </div >
    );
};

export default Stake;