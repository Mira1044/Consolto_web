import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/shared/utils/formatters/priceFormatter';
import { toInputDateValue } from '@/shared/utils/formatters/dateFormatter';
import { Button, Input } from '@/shared/components/ui';

/**
 * BookingLayout
 * Presentational component for the booking flow.
 */
export const BookingLayout = ({
  expert,
  state,
  actions,
  navigateBack,
}) => {
  const {
    confirmed,
    duration,
    selectedDate,
    selectedSlot,
    frequency: _frequency,
    reason,
    message,
    price,
    canConfirm,
    summary,
    timeSlots,
  } = state;

  const {
    setDuration,
    setSelectedDate,
    setSelectedSlot,
    setFrequency: _setFrequency,
    setReason,
    setMessage,
    confirm,
  } = actions;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 lg:p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-emerald-500" size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">Booking confirmed!</h2>
          <p className="text-slate-600 text-base sm:text-lg mb-1">
            Your <span className="font-medium text-slate-700">{duration} min</span> session with
          </p>
          <p className="text-slate-800 font-semibold text-lg sm:text-xl mb-2">{expert.name}</p>
          <p className="text-slate-500 mb-3">
            {summary.dateLabel} at {summary.timeLabel}
          </p>
          <p className="text-blue-600 font-semibold text-lg sm:text-xl mb-8 sm:mb-10">
            ₹{formatINR(price)} paid
          </p>
          <Button
            className="rounded-xl px-10 py-4 text-lg !transition-none hover:!shadow-lg"
            size="lg"
            type="button"
            onClick={navigateBack}
          >
            Back to Experts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back + title - desktop */}
        <div className="mb-10">
          <Button
            className="mb-4 px-0 py-0 h-auto rounded-none shadow-none bg-transparent !transition-none hover:!bg-transparent hover:!text-slate-600"
            size="sm"
            type="button"
            variant="ghost"
            onClick={navigateBack}
          >
            <span className="inline-flex items-center gap-2 text-base font-medium">
              <ArrowLeft size={22} strokeWidth={2} />
              Back to Experts
            </span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Book Appointment</h1>
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
                  <p className="text-slate-500 mt-0.5">{expert.tags.slice(0, 2).join(', ')}</p>
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
              <Input
                className="max-w-xs cursor-pointer"
                min={toInputDateValue(new Date())}
                type="date"
                value={toInputDateValue(selectedDate)}
                onChange={(e) => {
                  if (e.target.value) {
setSelectedDate(new Date(`${e.target.value }T00:00:00`));
}
                }}
              />
              <p className="text-sm text-slate-500 mt-2">
                Click the field above to open the calendar and pick a date.
              </p>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-4">Select duration</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[15, 30].map((d) => {
                  const p = d === 15 ? expert.price15 : expert.price30;
                  const active = duration === d;
                  return (
                    <Button
                      key={d}
                      className={`w-full rounded-xl border-2 px-5 sm:px-8 py-4 sm:py-5 text-center !transition-none ${
                        active
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 hover:!bg-blue-600 hover:!border-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:!bg-white hover:!border-slate-200 hover:!text-slate-700'
                      }`}
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => setDuration(d)}
                    >
                      <div>
                        <p className="text-base font-semibold">{d} minutes</p>
                        <p className={`text-base mt-1 ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                          ₹{formatINR(p)}
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-4">
                Available time slots ({duration} minutes)
              </p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                {timeSlots.map((slot) => {
                  const active = selectedSlot === slot.time;
                  return (
                    <Button
                      key={slot.time}
                      className={`w-full sm:w-auto sm:min-w-[110px] rounded-xl border-2 px-4 sm:px-5 py-3 text-center !transition-none ${
                        active
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 hover:!bg-blue-600 hover:!border-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:!bg-white hover:!border-slate-200 hover:!text-slate-700'
                      }`}
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedSlot(slot.time)}
                    >
                      <p className="text-base font-semibold">{slot.time}</p>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Reason for visit */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-semibold text-slate-800 mb-3">Reason for visit</p>
              <textarea
                className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                placeholder="Why are you booking this appointment?"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 100))}
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
                className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                placeholder="Type your message here..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 100))}
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
                  <div className="grid grid-cols-[76px_1fr] items-start gap-2">
                    <span className="text-slate-600">Expert</span>
                    <span className="font-medium text-slate-800 text-right break-words leading-snug min-w-0">
                      {summary.expertName}
                    </span>
                  </div>

                  <div className="grid grid-cols-[76px_1fr] items-center gap-2">
                    <span>Duration</span>
                    <span className="font-medium text-slate-800 text-right">{summary.duration} min</span>
                  </div>

                  <div className="grid grid-cols-[76px_1fr] items-center gap-2">
                    <span>Date</span>
                    <span className="font-medium text-slate-800 text-right">{summary.dateLabel}</span>
                  </div>

                  <div className="grid grid-cols-[76px_1fr] items-center gap-2">
                    <span>Time</span>
                    <span className="font-medium text-slate-800 text-right">{summary.timeLabel}</span>
                  </div>

                  <div className="grid grid-cols-[76px_1fr] items-center gap-2">
                    <span>Frequency</span>
                    <span className="font-medium text-slate-800 text-right">{summary.frequencyLabel}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <div className="grid grid-cols-[76px_1fr] items-center gap-2 text-lg">
                      <span className="font-semibold text-slate-800">Total</span>
                      <span className="font-bold text-blue-600 text-right">₹{summary.priceLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                fullWidth
                className={`rounded-2xl py-5 text-lg !transition-none hover:!shadow-lg ${
                  canConfirm ? 'shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400 hover:!bg-slate-200'
                }`}
                disabled={!canConfirm}
                size="lg"
                type="button"
                onClick={confirm}
              >
                Confirm &amp; Pay ₹{formatINR(price)}
              </Button>

              <p className="text-sm text-slate-400 text-center">
                Fill in the reason for visit to enable payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
