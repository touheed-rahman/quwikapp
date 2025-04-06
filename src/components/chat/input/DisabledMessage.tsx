
interface DisabledMessageProps {
  disabledReason?: string;
}

const DisabledMessage = ({ disabledReason }: DisabledMessageProps) => {
  if (!disabledReason) return null;
  
  return (
    <div className="text-center text-muted-foreground mb-2 text-sm bg-muted/30 py-1.5 rounded-md">
      {disabledReason}
    </div>
  );
};

export default DisabledMessage;
