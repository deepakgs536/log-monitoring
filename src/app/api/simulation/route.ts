
import { NextResponse } from 'next/server';
import { setSimulationScenario, SimulationScenario } from '@/services/statsService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const scenario = body.scenario as SimulationScenario;

        if (!['normal', 'spike', 'failure', 'attack', 'recovery'].includes(scenario)) {
            return NextResponse.json({ error: 'Invalid scenario' }, { status: 400 });
        }

        setSimulationScenario(scenario);
        return NextResponse.json({ success: true, scenario });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to set scenario' }, { status: 500 });
    }
}
