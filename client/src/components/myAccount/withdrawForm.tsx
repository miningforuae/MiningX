import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  DollarSign,
  Loader2,
  ArrowRight,
  AlertCircle,
  Check,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processWithdrawal } from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store";

interface WithdrawalDialogProps {
  availableBalance: number;
  userEmail: string;
  onSuccess?: () => void;
}

const MIN_WITHDRAWAL = 50;

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({
  availableBalance,
  userEmail,
  onSuccess
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const resetState = (): void => {
    setAmount("");
    setError("");
    setShowSuccess(false);
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      resetState();
    }
  };

  const validateAmount = (value: string): string | null => {
    const withdrawalAmount = parseFloat(value);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return "Please enter a valid amount";
    }
    if (withdrawalAmount < MIN_WITHDRAWAL) {
      return `Minimum withdrawal amount is $${MIN_WITHDRAWAL}`;
    }
    if (withdrawalAmount > availableBalance) {
      return "Amount exceeds available balance";
    }
    return null;
  };

  const handleWithdrawal = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await dispatch(
        processWithdrawal({
          email: userEmail,
          amount: parseFloat(amount),
        })
      ).unwrap();
      
      setShowSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        setIsOpen(false);
        resetState();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to process withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
      <div className="px-48"> {/* Container with padding */}
  <Button
    size="lg"
    className="bg-gradient-to-br p-8 from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 ease-out hover:shadow-emerald-500/30 hover:scale-[1.02] w-full "
  >
    <DollarSign className="mr-2 h-10 w-10 text-4xl" />
    Withdraw Funds
  </Button>
</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 shadow-2xl shadow-emerald-500/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-emerald-50 font-bold flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="h-7 w-7 text-emerald-400" />
            </div>
            Withdraw Funds
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="flex flex-col gap-1 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Available Balance</span>
              <span className="text-2xl font-bold text-emerald-400">
                ${availableBalance?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-950/50 p-3 rounded-lg">
              <Info className="h-4 w-4 text-red" />
              Minimum withdrawal amount is ${MIN_WITHDRAWAL}
            </div>
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-500/20 p-3 text-emerald-400 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-emerald-400">Withdrawal Successful!</h3>
            <p className="text-zinc-400">
              Your withdrawal of ${parseFloat(amount).toFixed(2)} is being processed
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawal} className="mt-4 space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-zinc-300"
              >
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  min={MIN_WITHDRAWAL}
                  step="0.01"
                  disabled={isLoading}
                  className="pl-10 bg-zinc-950 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500 text-emerald-400 font-bold text-lg h-12"
                />
              </div>
            </div>

            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="ml-2 text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <div className="flex w-full flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading || !amount}
                  className="w-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-medium h-12 text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Withdrawal
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800 h-11"
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;