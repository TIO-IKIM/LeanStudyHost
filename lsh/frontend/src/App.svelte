<script>
    // https://carbon-components-svelte.onrender.com/components/FileUploader have a look here to improve the UI
	// export let name;
    import Dropzone from "svelte-file-dropzone";
    import {
    ComboBox,
    FileUploaderItem,
    MultiSelect,
    ProgressBar,
    TextArea
    } from "carbon-components-svelte";
    import Switch from "svelte-switch";
    import {TagList} from "./TagList";

    let files = {
    accepted: [],
    rejected: []
    };

    let studyTags = [];
    TagList.forEach(element => studyTags.push({ id: element.toLowerCase(), text: element }));

    let folderNames = new Set();
    let folders = [];

    let id = '';
    let comment = '';
    let isUploading = false;
    let patientNames = JSON.parse(window.patient_names)
    let patientsDropdown = []
    let tags = [];

    let ComboBoxId = 'ComboBoxId'
    let TextAreaId = 'TextAreaId'

    patientNames.forEach((element, index) => patientsDropdown.push({ id: String(index), text: element }))

    function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    files.accepted.forEach(element => {
        const splitPath = element.path.split('/');
        const folderPath = splitPath.length > 1 ? splitPath.slice(0, -1).join('/') : splitPath[0];
        folderNames.add(folderPath);
    });
    folders = [...folderNames];
}
function deleteItem(itemName){
    files.accepted = files.accepted.filter(item => !item.path.includes(itemName));
    folderNames.clear();
    files.accepted.forEach(element => {
        const splitPath = element.path.split('/');
        const folderPath = splitPath.length > 1 ? splitPath.slice(0, -1).join('/') : splitPath[0];
        folderNames.add(folderPath);
    });
    folders = [...folderNames];

}

  let checkedValue = true;

  function handleChange(e) {
    const { checked } = e.detail;
    checkedValue = checked;
  }
  function assignTags(e) {
      tags = e.selectedIds;
  }

async function handleSubmit(event) {
      event.preventDefault();
      if (!id) {
        alert('ID is required');
        return;
      }

      if (files.accepted.length === 0){
        alert('At least one valid file is required');
        return;
      } else if (files.accepted.length >= 1000){
        alert('Only uploads with fewer than 1000 files are permitted');
        return;
      }

      const formData = new FormData();
      formData.append('id', id);
      formData.append('comment', comment);
      formData.append('anonymize', checkedValue);
      // formData.append('tags', tags);
      files.accepted.forEach(file => formData.append('files', file));

      const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      try {
          isUploading = true;
          const response = await fetch(window.location.href, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRFToken': csrfToken
          }
      });
      if (response.ok) {
				alert('Files uploaded successfully');
			} else {
				throw new Error('Failed to upload files');
			}
      } catch (error) {
        alert('An error occurred while uploading the files');
      }
      window.location.reload();
      isUploading = false;
    }
</script>

<main>
	<h1>
		Data upload
	</h1>
	<div>
        <!--- filetypes from https://openslide.org -->
	    <Dropzone on:drop={handleFilesSelect} accept=".dcm, .DCM, .tif, .svs, .vms, .vmu, .ndpi, .scn, .mrxs, .tiff, .svslide, .bif" maxSize=50GB>
	     <p>Drag and drop files here or click to upload</p>
	    </Dropzone>
	</div>

    <div>
        <Switch
        on:change={handleChange}
        checked={checkedValue}
        onColor="#007bff"
        />
        <span class="switch-text">{checkedValue ? 'Deidentify files' : 'Keep personal information'}</span>

    </div>
	<ol>
	{#each folders as item}
        <FileUploaderItem
          id={item}
          name={item}
          status="edit"
          on:delete={(e) => {
            deleteItem(e.detail);
          }}
        />
	{/each}
	</ol>

    <form on:submit={handleSubmit}>
    <label for={ComboBoxId}>
          <ComboBox
            id={ComboBoxId}
            bind:value={id}
            titleText="Patient"
            placeholder='Choose ...'
            items={patientsDropdown}
          />
    </label>

    <label for={TextAreaId}>
         <TextArea
         id={TextAreaId}
         bind:value={comment}
         labelText='Comments'
         placeholder={checkedValue ? '(Optional) - must not contain information that allows identification. Will only be added to DICOM files' : '(Optional)  Will only be added to DICOM files'}/>
    </label>

<!--    <label>-->
<!--        <MultiSelect-->
<!--          titleText="Tags"-->
<!--          label="(Optional)"-->
<!--          items={studyTags}-->
<!--          on:select={(e) => assignTags(e.detail)}-->
<!--        />-->
<!--    </label>-->

        {#if isUploading}
            <ProgressBar helperText="Uploading ..." />
        {/if}

        <input type="submit" value="Upload" />
      </form>
</main>

<style>
/* Reset default styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}


/* Style the main container */
main {
  margin: 0 auto;
  padding: 20px;
}

/* Style the header */
h1 {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* Style the file uploader container */
div {
  margin-bottom: 20px;
}

/* Style the accepted file list */
ol {
  list-style: none;
  margin-bottom: 20px;
}

/* Style the form inputs */
label {
  display: block;
  margin-bottom: 10px;
}

input[type="submit"] {
  background-color: #007bff;
  color: #fff;
  display: block;
  margin: 0 auto;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #0062cc;
}

.switch-text {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  transform: translateY(-50%);
}

</style>
