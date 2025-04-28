import { useState } from 'react'
import './App.css'
import { primusProofTest } from './primus'

function App() {
    const [attestation, setAttestation] = useState('')
    const [channelLogin, setChannelLogin] = useState('itsfashr')
    const startAttFn = async () => {
        setAttestation('')
        if(!channelLogin){
            //It's not displayName but login， you can find it from twitch api on webpage
            alert("You must input a channel name")
            return;
        }
        await primusProofTest(channelLogin,(attestation) => {
            setAttestation(JSON.stringify(attestation))
        })
    }
    return (
        <>
            <h1>Primus Demo</h1>
            <div className="card">
                <div>
                   Verify channel:  <input value={channelLogin} onChange={(e)=>{setChannelLogin(e.target.value)}}/>
                </div>
                <hr/>
                <button onClick={startAttFn}>
                    Start Attestation
                </button>
            </div>
            <hr/>
            <span>{attestation}</span>
        </>
    )
}

export default App