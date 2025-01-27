package com.monitoring.usv.web.rest;

import com.monitoring.usv.domain.Photo;
import com.monitoring.usv.repository.PhotoRepository;
import com.monitoring.usv.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.monitoring.usv.domain.Photo}.
 */
@RestController
@RequestMapping("/api/photos")
@Transactional
public class PhotoResource {

    private static final Logger LOG = LoggerFactory.getLogger(PhotoResource.class);

    private static final String ENTITY_NAME = "photo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhotoRepository photoRepository;

    public PhotoResource(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    /**
     * {@code POST  /photos} : Create a new photo.
     *
     * @param photo the photo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new photo, or with status {@code 400 (Bad Request)} if the photo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Photo> createPhoto(@Valid @RequestBody Photo photo) throws URISyntaxException {
        LOG.debug("REST request to save Photo : {}", photo);
        if (photo.getId() != null) {
            throw new BadRequestAlertException("A new photo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        photo = photoRepository.save(photo);
        return ResponseEntity.created(new URI("/api/photos/" + photo.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, photo.getId().toString()))
            .body(photo);
    }

    /**
     * {@code PUT  /photos/:id} : Updates an existing photo.
     *
     * @param id the id of the photo to save.
     * @param photo the photo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated photo,
     * or with status {@code 400 (Bad Request)} if the photo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the photo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Photo> updatePhoto(@PathVariable(value = "id", required = false) final UUID id, @Valid @RequestBody Photo photo)
        throws URISyntaxException {
        LOG.debug("REST request to update Photo : {}, {}", id, photo);
        if (photo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, photo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!photoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        photo = photoRepository.save(photo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, photo.getId().toString()))
            .body(photo);
    }

    /**
     * {@code PATCH  /photos/:id} : Partial updates given fields of an existing photo, field will ignore if it is null
     *
     * @param id the id of the photo to save.
     * @param photo the photo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated photo,
     * or with status {@code 400 (Bad Request)} if the photo is not valid,
     * or with status {@code 404 (Not Found)} if the photo is not found,
     * or with status {@code 500 (Internal Server Error)} if the photo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Photo> partialUpdatePhoto(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Photo photo
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Photo partially : {}, {}", id, photo);
        if (photo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, photo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!photoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Photo> result = photoRepository
            .findById(photo.getId())
            .map(existingPhoto -> {
                if (photo.getPath() != null) {
                    existingPhoto.setPath(photo.getPath());
                }
                if (photo.getCreatedBy() != null) {
                    existingPhoto.setCreatedBy(photo.getCreatedBy());
                }
                if (photo.getCreatedDate() != null) {
                    existingPhoto.setCreatedDate(photo.getCreatedDate());
                }
                if (photo.getLastModifiedBy() != null) {
                    existingPhoto.setLastModifiedBy(photo.getLastModifiedBy());
                }
                if (photo.getLastModifiedDate() != null) {
                    existingPhoto.setLastModifiedDate(photo.getLastModifiedDate());
                }

                return existingPhoto;
            })
            .map(photoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, photo.getId().toString())
        );
    }

    /**
     * {@code GET  /photos} : get all the photos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of photos in body.
     */
    @GetMapping("")
    public List<Photo> getAllPhotos() {
        LOG.debug("REST request to get all Photos");
        return photoRepository.findAll();
    }

    /**
     * {@code GET  /photos/:id} : get the "id" photo.
     *
     * @param id the id of the photo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the photo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Photo> getPhoto(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Photo : {}", id);
        Optional<Photo> photo = photoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(photo);
    }

    /**
     * {@code DELETE  /photos/:id} : delete the "id" photo.
     *
     * @param id the id of the photo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Photo : {}", id);
        photoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
