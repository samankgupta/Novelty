import React from "react";
import { useNavigate } from 'react-router-dom';
import { Web3Storage } from 'web3.storage'
import { Helmet } from "react-helmet"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Stake = () => {

    const navigate = useNavigate();

    const [gamesList, setGamesList] = React.useState([])

    React.useEffect(() => {
        initialize();
    }, [])

    function makeStorageClient() {
        return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmODc2ZDA3OTE1ZUQ2ODA3NmFhYzU3YzBhMDZlYzgwODUyNDk4QUYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mzk1NTM2OTU3NjIsIm5hbWUiOiJub3ZlbHR5In0.NgSw8KJSdxahiHYLVcWs9x5p6t_hqv-EFlkznuyAByM" })
    }
    function makeFileObjects() {
        // You can create File objects from a Blob of binary data
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
        // Here we're just storing a JSON object, but you can store images,
        // audio, or whatever you want!
        const obj = gamesList
        const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

        const files = [
            new File([blob], 'games.json')
        ]
        return files
    }

    const initialize = async () => {

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

    const buyNFT = async (game) => {
        const web3 = new window.Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        const res = await web3.eth.sendTransaction({ to: "0x962C3B2D6Decc54Bd482517c7284116160B0d84b", from: accounts[0], value: web3.utils.toWei(game.price.toString()) });
        let temp = game
        temp.owner = accounts[0]
        temp.price += 0.2
        let changeVal = gamesList.find(g => g.name === game.name)
        gamesList[changeVal] = temp
        if (res) {
            const client = makeStorageClient()
            const files = makeFileObjects()
            const cid = await client.put(files)
            NotificationManager.success('Thanks for purchasing this NFT!', 'Transaction Successful!')
            setTimeout(() => {
                setGamesList([])
                initialize();
            }, 2500);
        }
    }

    return (
        <div className="bg-bgcolor min-h-screen">
            <Helmet>
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
            </Helmet>
            {gamesList.length > 0 ?
                <>
                    <h1 onClick={() => navigate('/')} className="text-4xl font-extrabold pt-10"><span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 filter drop-shadow hover:drop-shadow-lg">NOVELTY - NFT STORE</span></h1><br />
                    <table className="table-auto border-collapse w-full my-6">
                        <tbody className="text-md font-normal text-white">
                            <tr className="border-b border-slate-200 py-10">
                                <th className="px-2 py-2">S. No.</th>
                                <th className="px-2 py-2">Players</th>
                                <th className="px-2 py-2">Location</th>
                                <th className="px-2 py-2">Game Link</th>
                                <th className="px-2 py-2">NFT Price</th>
                                <th className="px-2 py-2">Owned By</th>
                                <th className="px-2 py-2">Buy</th>
                            </tr>
                            {gamesList.length > 0 ? gamesList.map((game, index) =>
                                <tr className="hover:bg-slate-800 border-b border-slate-200 py-10">
                                    <td className="px-2 py-2">{index + 1}</td>
                                    <td className="px-2 py-2">{game.name}</td>
                                    <td className="px-2 py-2">{game.place}</td>
                                    <td className="px-2 py-2"><a href={game.url} target="_blank" className="text-blue-600">Click To Open</a></td>
                                    <td className="px-2 py-2">{game.price}</td>
                                    <td className="px-2 py-2">0xFE41bEcF3017775cA14E74bd778c2b13a5C67649</td>
                                    <td className="px-2 py-2">
                                        <button onClick={() => buyNFT(game)} className="text-white text-lg font-medium rounded-xl px-8 py-2 bg-gradient-to-r from-amber-600 to-amber-300 hover:from-amber-700 hover:to-amber-500 hover:shadow-2xl">Buy</button>
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