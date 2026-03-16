import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface Expert {
  id: number;
  name: string;
  tags: string[];
  rating: number | null;
  reviews: number | null;
  experience: string;
  sessions: number | null;
  price15: number;
  price30: number;
  initials: string;
  color: string;
}

const TIME_SLOTS = [
  { time: "11:30 AM", label: "Daily" },
  { time: "12:00 PM", label: "Daily" },
  { time: "2:30 PM", label: "Daily" },
  { time: "4:00 PM", label: "Daily" },
  { time: "5:30 PM", label: "Daily" },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { expert?: Expert; duration?: number } | null;
  const expert = state?.expert;
  const initialDuration = state?.duration ?? 15;

  const [confirmed, setConfirmed] = useState(false);
  const [duration, setDuration] = useState<15 | 30>(initialDuration === 30 ? 30 : 15);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("11:30 AM");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!expert) {
      navigate("/experts", { replace: true });
    }
  }, [expert, navigate]);

  if (!expert) return null;

  const price = duration === 15 ? expert.price15 : expert.price30;
  const canConfirm = selectedSlot !== "" && reason.trim().length > 0;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-24 flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-emerald-500" size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">Booking confirmed!</h2>
          <p className="text-slate-600 text-lg mb-1">
            Your <span className="font-medium text-slate-700">{duration} min</span> session with
          </p>
          <p className="text-slate-800 font-semibold text-xl mb-2">{expert.name}</p>
          <p className="text-slate-500 mb-3">
            {formatDate(selectedDate)} at {selectedSlot}
          </p>
          <p className="text-blue-600 font-semibold text-xl mb-10">
            ₹{price.toLocaleString("en-IN")} paid
          </p>
          <button
            type="button"
            onClick={() => navigate("/experts")}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-10 py-4 text-lg font-semibold text-white"
          >
            Back to Experts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Back + title - desktop */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => navigate("/experts")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-base font-medium mb-4"
          >
            <ArrowLeft size={22} strokeWidth={2} />
            Back to Experts
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Book Appointment</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expert card - desktop */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${expert.color}`}
                >
                  {expert.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-slate-900">{expert.name}</h2>
                  <p className="text-slate-500 mt-0.5">{expert.tags.slice(0, 2).join(", ")}</p>
                  {expert.rating !== null && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-amber-400 text-base">★</span>
                      <span className="text-base font-medium text-slate-700">
                        {expert.rating.toFixed(1)}
                      </span>
                      {expert.reviews != null && (
                        <span className="text-slate-400">({expert.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date picker - calendar opens on click */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-4">Select date</p>
              <input
                type="date"
                value={toInputValue(selectedDate)}
                min={toInputValue(new Date())}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(new Date(e.target.value + "T00:00:00"));
                }}
                className="w-full max-w-xs border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              />
              <p className="text-sm text-slate-500 mt-2">
                Click the field above to open the calendar and pick a date.
              </p>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-4">Select duration</p>
              <div className="flex gap-4">
                {([15, 30] as const).map((d) => {
                  const p = d === 15 ? expert.price15 : expert.price30;
                  const active = duration === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`rounded-xl border-2 px-8 py-5 text-center transition-all min-w-[140px] ${
                        active
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                          : "border-slate-200 hover:border-blue-300 text-slate-700"
                      }`}
                    >
                      <p className="text-base font-semibold">{d} minutes</p>
                      <p className={`text-base mt-1 ${active ? "text-blue-100" : "text-slate-400"}`}>
                        ₹{p.toLocaleString("en-IN")}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-4">
                Available time slots ({duration} minutes)
              </p>
              <div className="flex flex-wrap gap-3">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`rounded-xl border-2 px-5 py-3.5 text-center transition-all min-w-[110px] ${
                        active
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                          : "border-slate-200 hover:border-blue-300 text-slate-700"
                      }`}
                    >
                      <p className="text-base font-semibold">{slot.time}</p>
                      <p className={`text-sm mt-0.5 ${active ? "text-blue-100" : "text-slate-400"}`}>
                        {slot.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason for visit */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-3">Reason for visit</p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 100))}
                placeholder="Why are you booking this appointment?"
                rows={4}
                className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <p className="text-sm text-slate-400 text-right mt-2">{reason.length}/100</p>
            </div>

            {/* Message to consultant */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-0.5">
                Message to consultant
                <span className="font-normal text-slate-400 ml-1">(optional)</span>
              </p>
              <p className="text-sm text-slate-400 mb-3">
                Any specific concerns or information you want to share
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                placeholder="Type your message here..."
                rows={4}
                className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <p className="text-sm text-slate-400 text-right mt-2">{message.length}/100</p>
            </div>
          </div>

          {/* Right: sticky summary - desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking summary</h3>
                <div className="space-y-3 text-slate-600">
                  <p className="flex justify-between">
                    <span>Expert</span>
                    <span className="font-medium text-slate-800">{expert.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium text-slate-800">{duration} min</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium text-slate-800">{formatDate(selectedDate)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Time</span>
                    <span className="font-medium text-slate-800">{selectedSlot}</span>
                  </p>
                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <p className="flex justify-between text-lg">
                      <span className="font-semibold text-slate-800">Total</span>
                      <span className="font-bold text-blue-600">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canConfirm}
                onClick={() => setConfirmed(true)}
                className={`w-full rounded-2xl py-5 text-lg font-semibold transition-all ${
                  canConfirm
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Confirm &amp; Pay ₹{price.toLocaleString("en-IN")}
              </button>

              <p className="text-sm text-slate-400 text-center">
                Fill in the reason for visit to enable payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
