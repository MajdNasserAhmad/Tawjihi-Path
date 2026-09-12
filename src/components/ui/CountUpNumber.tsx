import { useCountUp } from '../../hooks/useCountUp';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function CountUpNumber({ value, prefix = '', suffix = '', className = '', duration = 2000 }: Props) {
  const { count, ref } = useCountUp(value, duration);
  return (
    <div ref={ref} className={className}>
      {prefix}{count}{suffix}
    </div>
  );
}
