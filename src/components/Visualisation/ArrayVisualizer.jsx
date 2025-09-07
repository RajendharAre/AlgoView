// src/components/Visualization/ArrayVisualizer.jsx
import SortingVisualizer from './SortingVisualizer';
import SearchingVisualizer from './SearchingVisualizer';

const ArrayVisualizer = ({ data, algorithmType }) => {
  switch (algorithmType) {
    case 'SORTING':
      return <SortingVisualizer data={data} />;
    case 'SEARCHING':
      return <SearchingVisualizer data={data} />;
    default:
      return (
        <div className="text-red-500">
          Visualization not available for this category yet.
        </div>
      );
  }
};

export default ArrayVisualizer;
