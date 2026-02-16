export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8 max-w-4xl">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted text-sm mt-1">Configure alerts, profiles, and system preferences.</p>
            </header>

            <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">User Profile</h3>
                <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-elevated border border-border" />
                    <div>
                        <h4 className="font-bold text-lg">Admin User</h4>
                        <p className="text-muted text-sm">admin@logops.internal</p>
                    </div>
                    <button className="ml-auto px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-elevated transition-colors">
                        Edit Profile
                    </button>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">System Configuration</h3>
                <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold">Data Retention</h4>
                            <p className="text-muted text-xs">How long to keep raw telemetry logs.</p>
                        </div>
                        <select className="bg-surface border border-border rounded-lg px-3 py-1 text-sm">
                            <option>7 Days</option>
                            <option>30 Days</option>
                            <option>90 Days</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold">Alert Sensitivity</h4>
                            <p className="text-muted text-xs">Threshold for anomaly detection.</p>
                        </div>
                        <select className="bg-surface border border-border rounded-lg px-3 py-1 text-sm">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>
    );
}
