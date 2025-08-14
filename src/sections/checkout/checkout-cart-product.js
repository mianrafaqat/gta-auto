import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

<<<<<<< Updated upstream
import { fCurrency } from "src/utils/format-number";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
=======
import { fCurrency } from 'src/utils/format-number';
>>>>>>> Stashed changes

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

import IncrementerButton from '../product/common/incrementer-button';

// ----------------------------------------------------------------------

<<<<<<< Updated upstream
export default function CheckoutCartProduct({
  row,
  onDelete,
  onDecrease,
  onIncrease,
}) {
  const router = useRouter();
  const { name, size, price, colors, coverUrl, quantity, available, slug, id } =
    row;

  const handleProductClick = () => {
    // Navigate to product details using slug if available, otherwise use ID
    const productPath = slug
      ? paths.product.details(slug)
      : paths.product.details(id);
    router.push(productPath);
  };

  return (
    <TableRow>
      <TableCell
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(76, 175, 80, 0.1)",
          },
        }}
        onClick={handleProductClick}>
        <Avatar
          variant="rounded"
          alt={name}
          src={coverUrl}
          sx={{ width: 64, height: 64, mr: 2 }}
        />

        <Stack spacing={0.5}>
          <Typography
            noWrap
            variant="subtitle2"
            sx={{
              maxWidth: 240,
              color: "#fff",
              "&:hover": {
                color: "#4caf50",
              },
            }}>
=======
export default function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }) {
  const { name, size, price, colors, coverUrl, quantity, available } = row;

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar variant="rounded" alt={name} src={coverUrl} sx={{ width: 64, height: 64, mr: 2 }} />

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
>>>>>>> Stashed changes
            {name}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'body2', color: 'text.secondary' }}
          >
            size: <Label sx={{ ml: 0.5 }}> {size} </Label>
            <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
            <ColorPreview colors={colors} />
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(price)}</TableCell>

      <TableCell>
        <Box sx={{ width: 88, textAlign: 'right' }}>
          <IncrementerButton
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={quantity <= 1}
            disabledIncrease={quantity >= available}
          />

          <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
            available: {available}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="right">{fCurrency(price * quantity)}</TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

CheckoutCartProduct.propTypes = {
  row: PropTypes.object,
  onDelete: PropTypes.func,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
};
