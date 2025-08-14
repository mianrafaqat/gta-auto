import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ price, regularPrice, salePrice }) {
  const displayPrice = salePrice > 0 ? salePrice : price;
  const hasSale = salePrice > 0 && salePrice < regularPrice;
  
  const safePrice = price || 0;
  const safeRegularPrice = regularPrice || safePrice;
  
  return (
    <Box>
      {hasSale && (
        <Box component="span" sx={{ textDecoration: 'line-through', color: 'text.disabled', mr: 1 }}>
          {fCurrency(safeRegularPrice)}
        </Box>
      )}
      <Box component="span" sx={{ color: hasSale ? 'error.main' : 'text.primary' }}>
        {fCurrency(displayPrice)}
      </Box>
    </Box>
  );
}

RenderCellPrice.propTypes = {
  price: PropTypes.number,
  regularPrice: PropTypes.number,
  salePrice: PropTypes.number,
};

export function RenderCellPublish({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const safeStatus = status || 'draft';

  return (
    <Label variant="soft" color={getStatusColor(safeStatus)}>
      {safeStatus}
    </Label>
  );
}

RenderCellPublish.propTypes = {
  status: PropTypes.string,
};

export function RenderCellCreatedAt({ value }) {
  if (!value) return '-';
  
  try {
    return (
      <Box>
        <Box component="span" sx={{ color: 'text.primary' }}>{fDate(value)}</Box>
        <Box component="span" sx={{ color: 'text.secondary', ml: 1, typography: 'caption' }}>
          {fTime(value)}
        </Box>
      </Box>
    );
  } catch (error) {
    return 'Invalid Date';
  }
}

RenderCellCreatedAt.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};

export function RenderCellStock({ stockStatus, stockQuantity }) {
  const getStockColor = (status) => {
    switch (status) {
      case 'out of stock': return 'error';
      case 'low stock': return 'warning';
      case 'in stock': return 'success';
      default: return 'default';
    }
  };

  const safeStockStatus = stockStatus || 'unknown';
  const safeStockQuantity = stockQuantity || 0;

  return (
    <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
      <Label variant="soft" color={getStockColor(safeStockStatus)}>
        {safeStockStatus}
      </Label>
      {safeStockQuantity !== undefined && (
        <Box component="span" sx={{ ml: 1 }}>
          ({safeStockQuantity})
        </Box>
      )}
    </Box>
  );
}

RenderCellStock.propTypes = {
  stockStatus: PropTypes.string,
  stockQuantity: PropTypes.number,
};

export function RenderCellProduct({ name, images, categories }) {
  const safeName = name || 'Unnamed Product';
  const safeImages = images || [];
  const safeCategories = categories || [];
  
  const firstImage = safeImages.length > 0 ? safeImages[0] : '/assets/placeholder.svg';
  const categoryName = safeCategories.length > 0 ? safeCategories[0].name : 'No Category';
  
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        alt={safeName}
        src={firstImage}
        variant="rounded"
        sx={{ width: 48, height: 48 }}
      />

      <Box>
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          sx={{ cursor: 'pointer', display: 'block', mb: 0.5 }}
        >
          {safeName}
        </Link>
        <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          {categoryName}
        </Box>
      </Box>
    </Stack>
  );
}

RenderCellProduct.propTypes = {
  name: PropTypes.string,
  images: PropTypes.array,
  categories: PropTypes.array,
};
