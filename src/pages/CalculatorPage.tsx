import { useState } from 'react';
import { Calculator, MapPin, Home, Utensils, Bus, HeartPulse, BookOpen, AlertCircle, Info } from 'lucide-react';
import { cities } from '@/data/cities';

type Nationality = 'eu' | 'non-eu';

export function CalculatorPage() {
  const [nationality, setNationality] = useState<Nationality>('non-eu');
  const [selectedCity, setSelectedCity] = useState<string>('amsterdam');
  const [duration, setDuration] = useState<number>(12);
  const [hasInsurance, setHasInsurance] = useState<boolean>(false);
  
  // Dynamic tuition based on nationality
  const [tuitionNonEu, setTuitionNonEu] = useState<number>(12000);
  const [tuitionEu, setTuitionEu] = useState<number>(2601); // Standard EU statutory rate
  
  // Use appropriate tuition based on nationality
  const tuition = nationality === 'eu' ? tuitionEu : tuitionNonEu;
  const setTuition = (val: number) => {
    if (nationality === 'eu') {
      setTuitionEu(val);
    } else {
      setTuitionNonEu(val);
    }
  };

  const city = cities.find(c => c.id === selectedCity) || cities[0];
  
  // IND requirement for non-EU: €1,350/month
  const indMonthlyRequirement = 1350;
  const indTotalRequired = nationality === 'non-eu' ? indMonthlyRequirement * duration : 0;
  
  const monthlyCosts = {
    rent: city.averageRent,
    utilities: city.utilities,
    groceries: city.groceries,
    transport: city.transport,
    insurance: hasInsurance ? 0 : city.insurance,
    leisure: city.leisure,
  };
  
  const totalMonthly = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);
  const totalLivingCost = totalMonthly * duration;
  const totalTuition = tuition * (duration / 12);
  const grandTotal = totalTuition + totalLivingCost;
  const shortfall = Math.max(0, indTotalRequired - totalLivingCost);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="animate-fade-in">
      <section className="bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-2 text-dutch-400 mb-4">
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Financial Planning</span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Cost of Living & IND Calculator
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Calculate your total study costs. EU students pay statutory tuition, Non-EU pay institutional rates.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-5">
              <h2 className="font-bold text-navy-900 mb-4">Your Situation</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nationality</label>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setNationality('non-eu')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        nationality === 'non-eu' 
                          ? 'bg-navy-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Non-EU
                    </button>
                    <button
                      onClick={() => setNationality('eu')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        nationality === 'eu' 
                          ? 'bg-navy-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      EU/EEA
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                  >
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                  >
                    <option value={12}>1 year (12 months)</option>
                    <option value={24}>2 years (24 months)</option>
                    <option value={36}>3 years (36 months)</option>
                    <option value={48}>4 years (48 months)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> 
                    Annual Tuition - {nationality === 'eu' ? 'EU Rate' : 'Non-EU Rate'} (€)
                  </label>
                  <input
                    type="number"
                    value={tuition}
                    onChange={(e) => setTuition(Number(e.target.value))}
                    className="w-full mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {nationality === 'eu' 
                      ? 'EU Statutory: €2,200-€5,000/year' 
                      : 'Non-EU Institutional: €8,000-€20,000+/year'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="rounded border-slate-300 text-dutch-500 focus:ring-dutch-500"
                  />
                  <label htmlFor="insurance" className="text-sm text-slate-700">
                    I already have health insurance arranged
                  </label>
                </div>
              </div>
            </div>

            {/* IND Requirements Box - Only for Non-EU */}
            {nationality === 'non-eu' && (
              <div className="card p-5 border-l-4 border-l-dutch-500">
                <h3 className="font-bold text-navy-900 flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-dutch-500" /> 
                  IND Requirements
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  For your MVV/Residence Permit, you must prove:
                </p>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Required per month:</span>
                    <span className="font-semibold">{formatCurrency(indMonthlyRequirement)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">For {duration} months:</span>
                    <span className="font-semibold text-navy-900">{formatCurrency(indTotalRequired)}</span>
                  </div>
                  {shortfall > 0 && (
                    <div className="flex justify-between text-sm text-red-600 mt-2 pt-2 border-t border-red-200">
                      <span>Shortfall:</span>
                      <span className="font-bold">{formatCurrency(shortfall)}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This must be in your bank account when applying for the visa.
                </p>
              </div>
            )}

            {/* EU Note */}
            {nationality === 'eu' && (
              <div className="card p-5 border-l-4 border-l-green-500 bg-green-50">
                <h3 className="font-bold text-green-900 flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4" /> 
                  EU/EEA Citizens
                </h3>
                <p className="text-sm text-green-800">
                  You pay the statutory tuition fee (€2,200-€5,000/year). No IND financial proof required, but you must register with the municipality for a BSN within 4 months of arrival.
                </p>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Summary */}
            <div className="card p-6 bg-navy-950 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Total Estimated Costs</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${nationality === 'eu' ? 'bg-green-500/20 text-green-400' : 'bg-dutch-500/20 text-dutch-400'}`}>
                  {nationality === 'eu' ? 'EU Rates' : 'Non-EU Rates'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm">Tuition ({duration/12} years)</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalTuition)}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(tuition)}/year ({nationality === 'eu' ? 'statutory' : 'institutional'})
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Living Costs</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalLivingCost)}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800">
                <p className="text-slate-400 text-sm">Grand Total</p>
                <p className="text-4xl font-bold text-dutch-400">{formatCurrency(grandTotal)}</p>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4">Monthly Living Costs in {city.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Rent</span>
                  </div>
                  <span className="font-semibold text-navy-900">{formatCurrency(monthlyCosts.rent)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Utensils className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Groceries</span>
                  </div>
                  <span className="font-semibold text-navy-900">{formatCurrency(monthlyCosts.groceries)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bus className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Transport</span>
                  </div>
                  <span className="font-semibold text-navy-900">{formatCurrency(monthlyCosts.transport)}</span>
                </div>
                {!hasInsurance && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HeartPulse className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">Health Insurance</span>
                    </div>
                    <span className="font-semibold text-navy-900">{formatCurrency(monthlyCosts.insurance)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-slate-300" />
                    <span className="text-sm font-medium text-slate-700">Utilities & Others</span>
                  </div>
                  <span className="font-semibold text-navy-900">{formatCurrency(monthlyCosts.utilities + monthlyCosts.leisure)}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-navy-900">Total Monthly</span>
                <span className="text-xl font-bold text-dutch-600">{formatCurrency(totalMonthly)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}