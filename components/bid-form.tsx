import { createBidAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

type BidFormProps = {
  loadId: string;
};

export function BidForm({ loadId }: BidFormProps) {
  return (
    <form action={createBidAction} className="space-y-4 rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft">
      <input type="hidden" name="load_id" value={loadId} />
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="bid_price">
          Your bid
        </label>
        <input
          id="bid_price"
          name="bid_price"
          type="number"
          min="1"
          step="100"
          required
          placeholder="4200"
          className="mt-2 w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 transition focus:ring"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="message">
          Note
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Fleet availability, pickup timing, equipment details..."
          className="mt-2 w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 transition focus:ring"
        />
      </div>

      <SubmitButton className="w-full bg-ink text-white hover:bg-slate" pendingLabel="Submitting bid...">
        Submit bid
      </SubmitButton>
    </form>
  );
}
